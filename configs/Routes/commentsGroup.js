const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const CommentsGroupController = controllers.CommentsGroupController;
const GroupController = controllers.GroupController;

const commentsGroupRouter = express.Router();
commentsGroupRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedCommentsGroupCreate(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    next();
  });
}

function isAuthenticatedCommentsGroup(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  CommentsGroupController.getOne(req.params.commentsGroup_id)
  .then((commentsGroup) => {
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != commentsGroup.user_id) && decoded.admin != 1)
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
@api {post} commentsGroups/create add a new commentsGroup
* @apiGroup CommentsGroups
* @apiHeader {String} x-access-token
* @apiParam {String} text obligatoire
* @apiParam {Int} group_id obligatoire
* @apiParamExample {json} Input
*  {
*    "text": "J'adore ce groupe",
*    "group_id": "1"
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
commentsGroupRouter.post('/create', isAuthenticatedCommentsGroupCreate, function(req, res) {

  const text = req.body.text;
  const group_id = req.body.group_id;

  asyncLib.waterfall([
    function(done){
      GroupController.getOne(group_id)
      .then((group) => {
        console.log("Success CommentsGroupController getOne");
        if(group === null || group === undefined)
          return res.status(400).json({"error": true, "message": "Le groupe n'existe pas"});
        done(null, group);
      })
      .catch((err) => {
        console.log("error CommentsGroupController getOne");
        console.log(err);
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du groupe"});
      });
    },
    function(group, done){
      console.log("CommentsGroupController add");
      console.log(text);
      console.log(getUserIdHeader(req));
      console.log(group.id);
      CommentsGroupController.add(text, getUserIdHeader(req), group.id)
      .then((commentsGroup) => {
        console.log("Success CommentsGroupController add");
        return res.status(201).json({"error": false});
      })
      .catch((err) => {
        console.log("error CommentsGroupController add");
        console.log(err);
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la création de votre commentaire"});
      });
    }
  ]);
});

/**
@api {get} commentsGroups/?group_id=group_id&user_id=user_id get all commentsGroups
* @apiGroup CommentsGroups
* @apiParam {String} group_id
* @apiParam {String} user_id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "text": "J'adore ce groupe",
*            "group_id": 1,
*            "user_id": 1,
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
commentsGroupRouter.get('/', function(req, res) {

  const group_id = req.query.group_id;
  const user_id = req.query.user_id;

  CommentsGroupController.getAll(user_id, group_id)
  .then((commentsGroups) => {
    if(commentsGroups.length == 0)
      return res.status(400).json({"error": true, "message": "Aucun commentaire trouvé"});
    return res.status(200).json({"error": false, "commentsGroup": commentsGroups});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des commentaires"});
  });
});

/**
@api {get} commentsGroups/:commentsgroup_id get commentsGroup
* @apiGroup CommentsGroups
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*            "id": 1,
*            "text": "J'adore ce groupe",
*            "group_id": 1,
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
commentsGroupRouter.get('/:commentsGroup_id', function(req, res) {
  const commentsGroup_id = req.params.commentsGroup_id;

  CommentsGroupController.getOne(commentsGroup_id)
  .then((commentsGroup) => {
    if(commentsGroup === undefined || commentsGroup === null)
      return res.status(400).json({"error": true, "message": "Le commentaire n'existe pas"});
    return res.status(200).json({"error": false, "commentsGroup": commentsGroup});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du commentaire"});
  });
});

/**
@api {put} commentsGroups/update/:commentsGroup_id update commentsGroup
* @apiGroup CommentsGroups
* @apiHeader {String} x-access-token
* @apiParam {String} text obligatoire
* @apiParamExample {json} Input
*  {
*     "text": "J'adore ce groupe",
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
commentsGroupRouter.put('/update/:commentsGroup_id', isAuthenticatedCommentsGroup, function(req, res){
  const commentsGroup_id = req.params.commentsGroup_id;
  const text = req.body.text;

  asyncLib.waterfall([
    function(done){
      CommentsGroupController.getOne(commentsGroup_id)
      .then((commentsGroup) => {
        if(commentsGroup === null || commentsGroup === undefined)
          return res.status(400).json({"error": true, "message": "Le commentaire n'existe pas"});
        done(null, commentsGroup);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du commentaire"});
      });
    },
    function(commentsGroup, done){
      CommentsGroupController.update(commentsGroup, text)
      .then((commentsGroup) => {
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
@api {delete} commentsGroups/delete/:commentsGroup_id delete commentsGroup
* @apiGroup CommentsGroups
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
commentsGroupRouter.delete('/delete/:commentsGroup_id', isAuthenticatedCommentsGroup, function(req, res){
  const commentsGroup_id = req.params.commentsGroup_id;

  asyncLib.waterfall([
    function(done){
      CommentsGroupController.getOne(commentsGroup_id)
      .then((commentsGroup) => {
        if(commentsGroup === null || commentsGroup === undefined){
          return res.status(400).json({"error": true, "message": "Le commentaire n'existe pas"});
        }
        done(null, commentsGroup);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du commentaire"});
      });
    },
    function(commentsGroup, done){
      CommentsGroupController.delete(commentsGroup);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


module.exports = commentsGroupRouter;
