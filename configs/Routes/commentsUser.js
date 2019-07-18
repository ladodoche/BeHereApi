const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const CommentsUserController = controllers.CommentsUserController;
const UserController = controllers.UserController;

const commentsUserRouter = express.Router();
commentsUserRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedCommentsUserCreate(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    next();
  });
}

function isAuthenticatedCommentsUser(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  CommentsUserController.getOne(req.params.commentsUser_id)
  .then((commentsUser) => {
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != commentsUser.user_id) && decoded.admin != 1)
        return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
      next();
    });
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du brasserie"});
  });
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
@api {post} commentsUsers/create add a new commentsUser
* @apiGroup CommentsUsers
* @apiHeader {String} x-access-token
* @apiParam {String} text obligatoire
* @apiParam {Int} user_comment_id obligatoire
* @apiParamExample {json} Input
*  {
*    "text": "J'adore cette utilisateur",
*    "user_comment_id": "1"
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
*        "message": "Erreur lors de la création de votre commentaire"
*    }
*/
commentsUserRouter.post('/create', isAuthenticatedCommentsUserCreate, function(req, res) {

  const text = req.body.text;
  const user_id = req.body.user_id;
  const user_comment_id = req.body.user_comment_id;

  asyncLib.waterfall([
    function(done){
      UserController.getOne(user_comment_id)
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
      CommentsUserController.add(text, user_id, user.id)
      .then((commentsUser) => {
        return res.status(201).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la création de votre commentaire"});
      });
    }
  ]);
});

/**
@api {get} commentsUsers/?user_id=user_id&user_comment_id=user_comment_id get all commentsUsers
* @apiGroup CommentsUsers
* @apiParam {String} user_id
* @apiParam {String} user_comment_id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "text": "J'adore ce user",
*            "user_id": 1,
*            "user_comment_id": 2,
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
*        "message": "Aucun commentaire trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération des commentaires"
*    }
*/
commentsUserRouter.get('/', function(req, res) {

  const user_id = req.query.user_id;
  const user_comment_id = req.query.user_comment_id;

  CommentsUserController.getAll(user_id, user_comment_id)
  .then((commentsUsers) => {
    if(commentsUsers.length == 0)
      return res.status(400).json({"error": true, "message": "Aucun commentaire trouvé"});
    return res.status(200).json({"error": false, "commentsUser": commentsUsers});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des commentaires"});
  });
});

/**
@api {get} commentsUsers/:commentsUser_id get commentsUser
* @apiGroup CommentsUsers
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*            "id": 1,
*            "text": "J'adore cette utlisateur",
*            "user_id": 1,
*            "user_id": 1,
*            "created_at": "2019-04-14T13:42:47.000Z",
*            "updated_at": "2019-04-14T13:42:47.000Z",
*            "deleted_at": null
*    }
* }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "Le commentaire n'existe pas"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération du commentaire"
*    }
*/
commentsUserRouter.get('/:commentsUser_id', function(req, res) {
  const commentsUser_id = req.params.commentsUser_id;

  CommentsUserController.getOne(commentsUser_id)
  .then((commentsUser) => {
    if(commentsUser === undefined || commentsUser === null)
      return res.status(400).json({"error": true, "message": "Le commentaire n'existe pas"});
    return res.status(200).json({"error": false, "commentsUser": commentsUser});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du commentaire"});
  });
});

/**
@api {put} commentsUsers/update/:commentsUser_id update commentsUser
* @apiGroup CommentsUsers
* @apiHeader {String} x-access-token
* @apiParam {String} text obligatoire
* @apiParamExample {json} Input
*  {
*     "text": "J'adore cette utilisateur",
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
commentsUserRouter.put('/update/:commentsUser_id', isAuthenticatedCommentsUser, function(req, res){
  const commentsUser_id = req.params.commentsUser_id;
  const text = req.body.text;

  asyncLib.waterfall([
    function(done){
      CommentsUserController.getOne(commentsUser_id)
      .then((commentsUser) => {
        if(commentsUser === null || commentsUser === undefined)
          return res.status(400).json({"error": true, "message": "Le commentaire n'existe pas"});
        done(null, commentsUser);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du commentaire"});
      });
    },
    function(commentsUser, done){
      CommentsUserController.update(commentsUser, text)
      .then((commentsUser) => {
        return res.status(200).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour du commentaire"});
      });
    }
  ]);
});

/**
@api {delete} commentsUsers/delete/:commentsUser_id delete commentsUser
* @apiGroup CommentsUsers
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
*        "message": "Le commentaire n'existe pas"
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
*        "message": "Erreur lors de la récupération du commentaire"
*    }
*/
commentsUserRouter.delete('/delete/:commentsUser_id', isAuthenticatedCommentsUser, function(req, res){
  const commentsUser_id = req.params.commentsUser_id;

  asyncLib.waterfall([
    function(done){
      CommentsUserController.getOne(commentsUser_id)
      .then((commentsUser) => {
        if(commentsUser === null || commentsUser === undefined){
          return res.status(400).json({"error": true, "message": "Le commentaire n'existe pas"});
        }
        done(null, commentsUser);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du commentaire"});
      });
    },
    function(commentsUser, done){
      CommentsUserController.delete(commentsUser);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


module.exports = commentsUserRouter;
