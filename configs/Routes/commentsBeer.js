const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const CommentsBeerController = controllers.CommentsBeerController;

const commentsBeerRouter = express.Router();
commentsBeerRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedCommentsBeerCreate(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    next();
  });
}

function isAuthenticatedCommentsBeer(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  CommentsBeerController.getOne(req.params.commentsBeer_id)
  .then((commentsBeer) => {
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != commentsBeer.user_id) && decoded.admin != 1)
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
@api {post} commentsBeers/create add a new commentsBeer
* @apiGroup CommentsBeers
* @apiHeader {String} x-access-token
* @apiParam {String} text obligatoire
* @apiParam {Int} beer_id obligatoire
* @apiParamExample {json} Input
*  {
*    "text": "J'adore cette bière",
*    "beer_id": "1"
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
commentsBeerRouter.post('/create', isAuthenticatedCommentsBeerCreate, function(req, res) {

  const text = req.body.text;
  const beer_id = req.body.beer_id;

  CommentsBeerController.add(text, getUserIdHeader(req), beer_id)
  .then((commentsBeer) => {
    return res.status(201).json({"error": false});
  })
  .catch((err) => {
    if(err.errors)
      return res.status(400).json({"error": true, "message": err.errors[0].message});
    return res.status(500).json({"error": true, "message": "Erreur lors de la création de votre commentaire"});
  });
});

/**
@api {get} commentsBeers/?beer_id=beer_id&user_id=user_id get all commentsBeers
* @apiGroup CommentsBeers
* @apiParam {String} beer_id
* @apiParam {String} user_id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "text": "J'adore cette bière",
*            "beer_id": 1,
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
commentsBeerRouter.get('/', function(req, res) {

  const beer_id = req.query.beer_id;
  const user_id = req.query.user_id;

  CommentsBeerController.getAll(user_id, beer_id)
  .then((commentsBeers) => {
    if(commentsBeers.length == 0)
      return res.status(400).json({"error": true, "message": "Aucune commentaire trouvé"});
    return res.status(200).json({"error": false, "commentsBeer": commentsBeers});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des commentaires"});
  });
});

/**
@api {get} commentsBeers/:commentsBeer_id get commentsBeer
* @apiGroup CommentsBeers
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*            "id": 1,
*            "text": "J'adore cette bière",
*            "beer_id": 1,
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
commentsBeerRouter.get('/:commentsBeer_id', function(req, res) {
  const commentsBeer_id = req.params.commentsBeer_id;

  CommentsBeerController.getOne(commentsBeer_id)
  .then((commentsBeer) => {
    if(commentsBeer === undefined || commentsBeer === null)
      return res.status(400).json({"error": true, "message": "le commentaire n'existe pas"});
    return res.status(200).json({"error": false, "commentsBeer": commentsBeer});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du commentaire"});
  });
});

/**
@api {put} commentsBeers/update/:commentsBeer_id update commentsBeer
* @apiGroup CommentsBeers
* @apiHeader {String} x-access-token
* @apiParam {String} text obligatoire
* @apiParamExample {json} Input
*  {
*     "text": "J'adore cette bière",
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
commentsBeerRouter.put('/update/:commentsBeer_id', isAuthenticatedCommentsBeer, function(req, res){
  const commentsBeer_id = req.params.commentsBeer_id;
  const text = req.body.text;

  asyncLib.waterfall([
    function(done){
      CommentsBeerController.getOne(commentsBeer_id)
      .then((commentsBeer) => {
        if(commentsBeer === null || commentsBeer === undefined)
          return res.status(400).json({"error": true, "message": "Le commentaire n'existe pas"});
        done(null, commentsBeer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du commentaire"});
      });
    },
    function(commentsBeer, done){
      CommentsBeerController.update(commentsBeer, text)
      .then((commentsBeer) => {
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
@api {delete} commentsBeers/delete/:commentsBeer_id delete commentsBeer
* @apiGroup CommentsBeers
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
commentsBeerRouter.delete('/delete/:commentsBeer_id', isAuthenticatedCommentsBeer, function(req, res){
  const commentsBeer_id = req.params.commentsBeer_id;

  asyncLib.waterfall([
    function(done){
      CommentsBeerController.getOne(commentsBeer_id)
      .then((commentsBeer) => {
        if(commentsBeer === null || commentsBeer === undefined){
          return res.status(400).json({"error": true, "message": "Le commentaire n'existe pas"});
        }
        done(null, commentsBeer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du commentaire"});
      });
    },
    function(commentsBeer, done){
      CommentsBeerController.delete(commentsBeer);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


module.exports = commentsBeerRouter;
