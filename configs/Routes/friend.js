const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const FriendController = controllers.FriendController;
const UserController = controllers.UserController;

const friendRouter = express.Router();
friendRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedUserCreate(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    next();
  });
}

function isAuthenticatedUser(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  FriendController.getOne(req.params.friend_id)
  .then((friend) => {
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != friend.user_id) && decoded.admin != 1)
        return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
      next();
    });
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du brasserie"});
  });
}

function isAuthenticatedFriend(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  FriendController.getOne(req.params.user_friend_id)
  .then((friend) => {
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != friend.user_friend_id) && decoded.admin != 1)
        return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
      next();
    });
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du brasserie"});
  });
}

function isAuthenticatedUserOrFriend(req, res, next) {
  const token = req.headers['x-access-token'];
  const friend_id = req.params.friend_id;

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  asyncLib.waterfall([
    function(done){
      FriendController.getAll(getUserIdHeader(req), friend_id)
      .then((friend) => {
        if(friend === null || friend === undefined)
          done(null, null)
          //return res.status(400).json({"error": true, "message": "Le lien d'amitié n'existe pas"});
        done(null, friend);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'ami"});
      });
    },
    function(friend, done){
      FriendController.getAll(friend_id, getUserIdHeader(req))
      .then((friend2) => {
        if(friend2 === null || friend2 === undefined){}
          if(friend == null)
            return res.status(400).json({"error": true, "message": "Le lien d'amitié n'existe pas"});
        if(friend == null)
          done(null, friend2);
        done(null, friend);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'ami"});
      });
    },
    function(friend, done){
      jwt.verify(token, auth.secret, function(err, decoded) {
        if (err)
          return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
        if ((decoded.id != friend.user_friend_id) && (friend.user_id != getUserIdHeader(req)) && decoded.admin != 1)
          return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
        next();
      });
    }
  ]);
}

function getUserIdHeader(req, next){
  var token = req.headers['x-access-token'];
  if(token){
    return jwt.verify(token, auth.secret, function(err, decoded) {
      return decoded.id;
    });
  }
  return undefined;
}

/**
@api {post} friends/create add a new friend
* @apiGroup Friends
* @apiHeader {String} x-access-token
* @apiParam {Int} user_friend_id obligatoire
* @apiParamExample {json} Input
*  {
*    "user_friend_id": "2"
*  }
* @apiSuccessExample {json} Success
*    HTTP/1.1 201 Created
*    {
*        "error": false
*    }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": message
*    }
*
*    HTTP/1.1 401 Unauthorized
*    {
*        "error": true,
*        "message": message
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de votre demande d'ami"
*    }
*/
friendRouter.post('/create', isAuthenticatedUserCreate, function(req, res) {

  const user_friend_id = req.body.user_friend_id;

  if(user_friend_id == undefined)
    return res.status(400).json({"error": true, "message": "Veuillez saisir une personne pour faire la demande"});

  if(user_friend_id == getUserIdHeader(req))
    return res.status(400).json({"error": true, "message": "Vous ne pouvez pas vous demander en ami"});

  asyncLib.waterfall([
    function(done){
      UserController.getOne(user_friend_id)
      .then((user) => {
        if(user === null || user === undefined)
          return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"});
        done(null, user);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"});
      });
    },
    function(user, done){
      FriendController.getAll(getUserIdHeader(req), user_friend_id)
      .then((user1) => {
        if(user1.length != 0)
          return res.status(400).json({"error": true, "message": "Vous avez déjà demandé cette utilisateur en ami"});
        done(null, user);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"});
      });
    },
    function(user, done){
      FriendController.getAll(user_friend_id, getUserIdHeader(req))
      .then((user2) => {
      if(user2.length != 0)
          return res.status(400).json({"error": true, "message": "Cette utilisateur vous a déjà demandé en ami"});
        done(null, user);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"});
      });
    },
    function(user, done){
      FriendController.add(getUserIdHeader(req), user_friend_id)
      .then((friend) => {
        return res.status(201).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de votre demande d'ami"});
      });
    }
  ]);
});

/**
@api {put} friends/accepted/:friend_id update friend
* @apiGroup Friends
* @apiHeader {String} x-access-token
* @apiParam {String} user_friend_id user_friend_id
* @apiParamExample {json} Input
*  {
*     "user_friend_id": "2",
*  }
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
*    {
*        "error": false
*    }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": message
*    }
*
*    HTTP/1.1 401 Unauthorized
*    {
*        "error": true,
*        "message": message
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": message
*    }
*/
friendRouter.put('/accepted/:friend_id', isAuthenticatedFriend, function(req, res){
  const friend_id = req.params.friend_id;

  asyncLib.waterfall([
    function(done){
      FriendController.getOne(friend_id)
      .then((friend) => {
        if(friend === null || friend === undefined)
          return res.status(400).json({"error": true, "message": "Le lien d'amitié n'existe pas"});
        done(null, friend);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'ami"});
      });
    },
    function(friend, done){
      FriendController.update(friend, true)
      .then((friend) => {
        return res.status(200).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour du lien d'amitié"});
      });
    }
  ]);
})

/**
@api {get} friends get all friends
* @apiGroup Friends
* @apiParam {Int} user_id
* @apiParam {Int} user_friend_id
* @apiParam {bool} status
* @apiParam {Int} id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "user_id": "1",
*            "user_friend_id": 1,
*            "status": 0,
*            "created_at": "2019-04-14T13:42:47.000Z",
*            "updated_at": "2019-04-14T13:42:47.000Z",
*            "deleted_at": null
*        }
*    ]
* }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "Aucun lien d'amitié trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération des amis"
*    }
*/
friendRouter.get('/', function(req, res) {

  const user_id = req.query.user_id;
  const user_friend_id = req.query.user_friend_id;
  const status = req.query.status;
  const id = req.query.id;

  FriendController.getAll(user_id, user_friend_id, status, id)
  .then((friends) => {
    if(friends.length == 0)
      return res.status(400).json({"error": true, "message": "Aucun lien d'amitié trouvé"});
    return res.status(200).json({"error": false, "friend": friends});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des amis"});
  });
});

/**
@api {get} friends/:friend_id get friend
* @apiGroup Friends
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*            "id": 1,
*            "user_id": "1",
*            "user_friend_id": 1,
*            "status": 0,
*            "created_at": "2019-04-14T13:42:47.000Z",
*            "updated_at": "2019-04-14T13:42:47.000Z",
*            "deleted_at": null
*    }
* }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "Le lien d'amitié n'existe pas"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération de l'ami"
*    }
*/
friendRouter.get('/:friend_id', function(req, res) {
  const friend_id = req.params.friend_id;

  FriendController.getOne(friend_id)
  .then((friend) => {
    if(friend === undefined || friend === null)
      return res.status(400).json({"error": true, "message": "Le lien d'amitié n'existe pas"});
    return res.status(200).json({"error": false, "friend": friend});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'ami"});
  });
});

/**
@api {delete} friends/delete/:friend_id delete friend
* @apiGroup Friends
* @apiHeader {String} x-access-token
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Success
*    {
*        "error": false
*    }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "Le lien d'amitié n'existe pas"
*    }
*
*    HTTP/1.1 401 Unauthorized
*    {
*        "error": true,
*        "message": message
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération de l'ami"
*    }
*/
friendRouter.delete('/delete/:friend_id', isAuthenticatedUserOrFriend, function(req, res){
  const friend_id = req.params.friend_id;

  asyncLib.waterfall([
    function(done){
      FriendController.getOne(friend_id)
      .then((friend) => {
        if(friend === null || friend === undefined)
          return res.status(400).json({"error": true, "message": "Le lien d'amitié n'existe pas"});
        done(null, friend);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'ami"});
      });
    },
    function(friend, done){
      FriendController.delete(friend);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


module.exports = friendRouter;
