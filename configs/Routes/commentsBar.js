const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const CommentsBarController = controllers.CommentsBarController;
const BarController = controllers.BarController;

const commentsBarRouter = express.Router();
commentsBarRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedCommentsBarCreate(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    next();
  });
}

function isAuthenticatedCommentsBar(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  CommentsBarController.getOne(req.params.commentsBar_id)
  .then((commentsBar) => {
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != commentsBar.user_id) && decoded.admin != 1)
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
@api {post} commentsBars/create add a new commentsBar
* @apiGroup CommentsBars
* @apiHeader {String} x-access-token
* @apiParam {String} text obligatoire
* @apiParam {Int} bar_id obligatoire
* @apiParamExample {json} Input
*  {
*    "text": "J'adore ce bar",
*    "bar_id": "1"
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
commentsBarRouter.post('/create', isAuthenticatedCommentsBarCreate, function(req, res) {

  const text = req.body.text;
  const bar_id = req.body.bar_id;

  asyncLib.waterfall([
    function(done){
      BarController.getOne(bar_id)
      .then((bar) => {
        if(bar === null || bar === undefined)
          return res.status(400).json({"error": true, "message": "Le bar n'existe pas"});
        done(null, bar);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du commentaire"});
      });
    },
    function(bar, done){
      CommentsBarController.add(text, getUserIdHeader(req), bar.id)
      .then((commentsBar) => {
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
@api {get} commentsBars/?bar_id=bar_id&user_id=user_id get all commentsBars
* @apiGroup CommentsBars
* @apiParam {String} bar_id
* @apiParam {String} user_id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "text": "J'adore ce bar",
*            "bar_id": 1,
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
commentsBarRouter.get('/', function(req, res) {

  const bar_id = req.query.bar_id;
  const user_id = req.query.user_id;

  CommentsBarController.getAll(user_id, bar_id)
  .then((commentsBars) => {
    if(commentsBars.length == 0)
      return res.status(400).json({"error": true, "message": "Aucun commentaire trouvé"});
    return res.status(200).json({"error": false, "commentsBar": commentsBars});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des commentaires"});
  });
});

/**
@api {get} commentsBars/:commentsBar_id get commentsBar
* @apiGroup CommentsBars
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*            "id": 1,
*            "text": "J'adore ce bar",
*            "bar_id": 1,
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
commentsBarRouter.get('/:commentsBar_id', function(req, res) {
  const commentsBar_id = req.params.commentsBar_id;

  CommentsBarController.getOne(commentsBar_id)
  .then((commentsBar) => {
    if(commentsBar === undefined || commentsBar === null)
      return res.status(400).json({"error": true, "message": "Le commentaire n'existe pas"});
    return res.status(200).json({"error": false, "commentsBar": commentsBar});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du commentaire"});
  });
});

/**
@api {put} commentsBars/update/:commentsBar_id update commentsBar
* @apiGroup CommentsBars
* @apiHeader {String} x-access-token
* @apiParam {String} text obligatoire
* @apiParamExample {json} Input
*  {
*     "text": "J'adore ce bar",
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
commentsBarRouter.put('/update/:commentsBar_id', isAuthenticatedCommentsBar, function(req, res){
  const commentsBar_id = req.params.commentsBar_id;
  const text = req.body.text;

  asyncLib.waterfall([
    function(done){
      CommentsBarController.getOne(commentsBar_id)
      .then((commentsBar) => {
        if(commentsBar === null || commentsBar === undefined)
          return res.status(400).json({"error": true, "message": "Le commentaire n'existe pas"});
        done(null, commentsBar);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du commentaire"});
      });
    },
    function(commentsBar, done){
      CommentsBarController.update(commentsBar, text)
      .then((commentsBar) => {
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
@api {delete} commentsBars/delete/:commentsBar_id delete commentsBar
* @apiGroup CommentsBars
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
commentsBarRouter.delete('/delete/:commentsBar_id', isAuthenticatedCommentsBar, function(req, res){
  const commentsBar_id = req.params.commentsBar_id;

  asyncLib.waterfall([
    function(done){
      CommentsBarController.getOne(commentsBar_id)
      .then((commentsBar) => {
        if(commentsBar === null || commentsBar === undefined){
          return res.status(400).json({"error": true, "message": "Le commentaire n'existe pas"});
        }
        done(null, commentsBar);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du commentaire"});
      });
    },
    function(commentsBar, done){
      CommentsBarController.delete(commentsBar);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


module.exports = commentsBarRouter;
