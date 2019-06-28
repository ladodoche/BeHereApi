const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const MessageController = controllers.MessageController;
const UserController = controllers.UserController;
const GroupController = controllers.GroupController;
const NotificationController = require('../../notifications').NotificationController;

const messageRouter = express.Router();
messageRouter.use(bodyParser.json({limit: '10mb'}));

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
@api {post} messages/create add a new message
* @apiGroup messages
* @apiHeader {String} x-access-token
* @apiBody {Int} text obligatoire
* @apiBody {Int} user_receiver_id
* @apiBody {Int} group_id
* @apiParamExample {json} Input
*  {
*    "text": "2"
*    "user_receiver_id": "2"
*    "group_id": "2"
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
*        "message": "Erreur lors de l'envoie de message"
*    }
*/
messageRouter.post('/create', isAuthenticatedUserCreate, function(req, res) {

  const text = req.body.text;
  const user_receiver_id = req.body.user_receiver_id;
  const group_id = req.body.group_id;

  if((user_receiver_id != null || user_receiver_id != undefined) && (group_id != null || group_id != undefined)){
    return res.status(400).json({"error": true, "message": "erreur"});
  }else if(user_receiver_id != null || user_receiver_id != undefined) {
    asyncLib.waterfall([
      function(done){
        UserController.getOne(user_receiver_id)
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
        MessageController.add(getUserIdHeader(req), text, user_receiver_id, undefined)
        .then((message) => {
          NotificationController.sendMessageUser(message, user);
          return res.status(201).json({"error": false});
        })
        .catch((err) => {
          if(err.errors)
            return res.status(400).json({"error": true, "message": err.errors[0].message});
          return res.status(500).json({"error": true, "message": "Erreur lors de l'envoie de message"});
        });
      }
    ]);
  }else if(group_id != null || group_id != undefined) {
    asyncLib.waterfall([
      function(done){
        GroupController.getOne(group_id)
        .then((group) => {
          if(group === null || group === undefined)
            return res.status(400).json({"error": true, "message": "Le groupe n'existe pas"});
          done(null, group);
        })
        .catch((err) => {
            return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du groupe"});
        });
      },
      function(group, done){
        MessageController.add(getUserIdHeader(req), text, undefined, group_id)
        .then((message) => {
          for (var i = 0 ; i < group.user ; i++)
            NotificationController.sendMessageGroup(message, group.user[i], group);
          return res.status(201).json({"error": false});
        })
        .catch((err) => {
          if(err.errors)
            return res.status(400).json({"error": true, "message": err.errors[0].message});
          return res.status(500).json({"error": true, "message": "Erreur lors de l'envoie de message"});
        });
      }
    ]);
  }
});


/**
@api {get} messages get all messages
* @apiGroup Messages
* @apiParam {Int} user_sender_id
* @apiParam {Int} user_receiver_id
* @apiParam {Int} group_id
* @apiParam {bool} status
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "user_sender_id": "1",
*            "user_receiver_id": 1,
*            "group_id": 1,
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
*        "message": "Aucun message trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de l'envoi de message"
*    }
*/
messageRouter.get('/', function(req, res) {

  const user_sender_id = req.query.user_sender_id;
  const user_receiver_id = req.query.user_receiver_id;
  const group_id = req.query.group_id;

  MessageController.getAll(getUserIdHeader(req), user_receiver_id, group_id)
  .then((messages) => {
    if(messages.length == 0)
      return res.status(400).json({"error": true, "message": "Aucun message trouvé"});
    return res.status(200).json({"error": false, "message": messages});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de l'envoi de message"});
  });
});

module.exports = messageRouter;
