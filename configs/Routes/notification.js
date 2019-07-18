const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const NotificationController = controllers.NotificationController;
const UserController = controllers.UserController;
const GroupController = controllers.GroupController;

const notificationRouter = express.Router();
notificationRouter.use(bodyParser.json({limit: '10mb'}));

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
@api {post} notifications/create add a new notification
* @apiGroup Notifications
* @apiHeader {String} x-access-token
* @apiParam {Int} texte obligatoire
* @apiParam {Int} type obligatoire
* @apiParam {Int} user_id
* @apiParam {Int} other_user_id
* @apiParam {Int} group_id
* @apiParamExample {json} Input
*  {
*    "texte": "coucou"
*    "type": "message user"
*    "user_id": 1
*    "other_user_id": 2
*    "group_id": null
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
*        "notification": message
*    }
*
*    HTTP/1.1 401 Unauthorized
*    {
*        "error": true,
*        "notification": message
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "notification": message
*    }
*/
notificationRouter.post('/create', function(req, res) {

  const texte = req.body.texte;
  const type = req.body.type;
  const user_id = req.body.user_id;
  const other_user_id = req.body.other_user_id;
  const group_id = req.body.group_id;

  if((other_user_id != null || other_user_id != undefined)
    && (group_id != null || group_id != undefined)){
    return res.status(400).json({"error": true, "notification": "erreur"});
  }
  if(other_user_id != null || other_user_id != undefined) {
    asyncLib.waterfall([
      function(done){
        UserController.getOne(other_user_id)
        .then((user) => {
          if(user === null || user === undefined)
            return res.status(400).json({"error": true, "notification": "L'utilisateur n'existe pas"});
          done(null, user);
        })
        .catch((err) => {
            return res.status(500).json({"error": true, "notification": "Erreur lors de la récupération de l'utilisateur"});
        });
      },
      function(user, done){
        console.log("0");
        NotificationController.add(texte, type, user_id, other_user_id, undefined)
        .then((notification) => {
          console.log("1");
          return res.status(201).json({"error": false});
        })
        .catch((err) => {
          console.log("2");
          console.log(err);
          if(err.errors)
            return res.status(400).json({"error": true, "notification": err.errors[0].message});
          return res.status(500).json({"error": true, "notification": "Erreur lors de l'envoie de notification"});
        });
      }
    ]);
  }
  if(group_id != null || group_id != undefined) {
    asyncLib.waterfall([
      function(done){
        GroupController.getOne(group_id)
        .then((group) => {
          if(group === null || group === undefined)
            return res.status(400).json({"error": true, "notification": "Le groupe n'existe pas"});
          done(null, group);
        })
        .catch((err) => {
            return res.status(500).json({"error": true, "notification": "Erreur lors de la récupération du groupe"});
        });
      },
      function(group, done){
        NotificationController.add(texte, type, user_id, undefined, group_id)
        .then((notification) => {
          return res.status(201).json({"error": false});
        })
        .catch((err) => {
          if(err.errors)
            return res.status(400).json({"error": true, "notification": err.errors[0].message});
          return res.status(500).json({"error": true, "notification": "Erreur lors de l'envoie de notification"});
        });
      }
    ]);
  }
});


/**
@api {get} notifications get all notifications
* @apiGroup Notifications
* @apiHeader {String} x-access-token
* @apiParam {Int} user_id
* @apiParam {Int} other_user_id
* @apiParam {Int} group_id
* @apiParam {bool} status
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "notification": [
*        {
*            "id": 1,
*            "texte": "coucou",
*            "type": "message user",
*            "user_id": "1",
*            "other_user_id": 2,
*            "group_id": null,
*            "status": true,
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
*        "notification": "Aucune notification trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "notification": "Erreur lors de l'envoi de le notification"
*    }
*/
notificationRouter.get('/', function(req, res) {

  const user_id = req.query.user_id;
  const other_user_id = req.query.other_user_id;
  const group_id = req.query.group_id;
  const statut = req.query.statut;

  console.log(user_id);
  console.log(other_user_id);
  console.log(group_id);
  console.log(statut);

  NotificationController.getAll(user_id, other_user_id, group_id, statut)
  .then((notifications) => {
    console.log("1");
    if(notifications.length == 0)
      return res.status(400).json({"error": true, "notification": "Aucune notification trouvé"});
    return res.status(200).json({"error": false, "notification": notifications});
  })
  .catch((err) => {
    console.log("0");
    console.log(err);
    return res.status(500).json({"error": true, "notification": "Erreur lors de la récupération de la notification"});
  });
});

/**
@api {get} notifications get all notifications
* @apiGroup Notifications
* @apiHeader {String} x-access-token
* @apiParam {String} notification_id obligatoire
* @apiParamExample {json} Input
*  {
*     "notification_id": 1,
*  }
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
*    {
*     "notification": [
*        {
*            "id": 1,
*            "texte": "coucou",
*            "type": "message user",
*            "user_id": "1",
*            "other_user_id": 2,
*            "group_id": null,
*            "status": true,
*            "created_at": "2019-04-14T13:42:47.000Z",
*            "updated_at": "2019-04-14T13:42:47.000Z",
*            "deleted_at": null
*        }
*    ]
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
notificationRouter.get('/:notification_id', function(req, res) {
  const notification_id = req.params.notification_id;

  NotificationController.getOne(notification_id)
  .then((notification) => {
    if(notification === undefined || notification === null)
      return res.status(400).json({"error": true, "message": "La notification n'existe pas"});
    return res.status(200).json({"error": false, "notification": notification});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la notification"});
  });
});

/**
@api {put} notifications/update/:notification_id update brewery
* @apiGroup Notifications
* @apiHeader {String} x-access-token
* @apiParam {String} notification_id obligatoire
* @apiParam {Date} type
* @apiParam {Date} statut
* @apiParam {textee} texte
* @apiParamExample {json} Input
*  {
*    "statut": true,
*    "notification_id": ""
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
notificationRouter.put('/update/:notification_id', function(req, res){

  const notification_id = req.params.notification_id;
  const texte = req.body.texte;
  const type = req.body.type;
  const statut = req.body.statut;
  const user_id = req.body.user_id;
  const other_user_id = req.body.other_user_id;
  const group_id = req.body.group_id;

  asyncLib.waterfall([
    function(done){
      NotificationController.getOne(notification_id)
      .then((notification) => {
        if(notification === null || notification === undefined)
          return res.status(400).json({"error": true, "message": "La notification n'existe pas"});
        done(null, notification);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la notification"});
      });
    },
    function(notification, done){
      console.log("1");
      NotificationController.update(notification, texte, type, statut, user_id, other_user_id, group_id)
      .then((notification) => {
        return res.status(200).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour de l'évènement"});
      });
    }
  ]);
});


/**
@api {delete} notifications/delete/:notification_id delete notification
* @apiGroup Notifications
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
*        "message": "L'évènement n'existe pas"
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
*        "message": "Erreur lors de la récupération de l'évènement"
*    }
*/
notificationRouter.delete('/delete/:notification_id', function(req, res){
  const notification_id = req.params.notification_id;

  asyncLib.waterfall([
    function(done){
      NotificationController.getOne(notification_id)
      .then((notification) => {
        if(notification === null || notification === undefined){
          return res.status(400).json({"error": true, "message": "L'évènement n'existe pas"});
        }
        done(null, notification);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'évènement"});
      });
    },
    function(notification, done){
      NotificationController.delete(notification);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});

module.exports = notificationRouter;
