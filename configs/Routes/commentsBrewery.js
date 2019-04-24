const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const CommentsBreweryController = controllers.CommentsBreweryController;
const BreweryController = controllers.BreweryController;

const commentsBreweryRouter = express.Router();
commentsBreweryRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedCommentsBreweryCreate(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    next();
  });
}

function isAuthenticatedCommentsBrewery(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  CommentsBreweryController.getOne(req.params.commentsBrewery_id)
  .then((commentsBrewery) => {
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != commentsBrewery.user_id) && decoded.admin != 1)
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
@api {post} commentsBrewerys/create add a new commentsBrewery
* @apiGroup CommentsBrewerys
* @apiHeader {String} x-access-token
* @apiParam {String} text obligatoire
* @apiParam {Int} brewery_id obligatoire
* @apiParamExample {json} Input
*  {
*    "text": "J'adore cette brasserie",
*    "brewery_id": "1"
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
commentsBreweryRouter.post('/create', isAuthenticatedCommentsBreweryCreate, function(req, res) {

  const text = req.body.text;
  const brewery_id = req.body.brewery_id;

  asyncLib.waterfall([
    function(done){
      BreweryController.getOne(brewery_id)
      .then((brewery) => {
        if(brewery === null || brewery === undefined)
          return res.status(400).json({"error": true, "message": "La brasserie n'existe pas"});
        done(null, brewery);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du commentaire"});
      });
    },
    function(brewery, done){
      CommentsBreweryController.add(text, getUserIdHeader(req), brewery.id)
      .then((commentsBrewery) => {
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
@api {get} commentsBrewerys/?brewery_id=brewery_id&user_id=user_id get all commentsBrewerys
* @apiGroup CommentsBrewerys
* @apiParam {String} brewery_id
* @apiParam {String} user_id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "text": "J'adore cette brasserie",
*            "brewery_id": 1,
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
commentsBreweryRouter.get('/', function(req, res) {

  const brewery_id = req.query.brewery_id;
  const user_id = req.query.user_id;

  CommentsBreweryController.getAll(user_id, brewery_id)
  .then((commentsBrewerys) => {
    if(commentsBrewerys.length == 0)
      return res.status(400).json({"error": true, "message": "Aucun commentaire trouvé"});
    return res.status(200).json({"error": false, "commentsBrewery": commentsBrewerys});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des commentaires"});
  });
});

/**
@api {get} commentsBrewerys/:commentsBrewery_id get commentsBrewery
* @apiGroup CommentsBrewerys
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*            "id": 1,
*            "text": "J'adore cette brasserie",
*            "brewery_id": 1,
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
commentsBreweryRouter.get('/:commentsBrewery_id', function(req, res) {
  const commentsBrewery_id = req.params.commentsBrewery_id;

  CommentsBreweryController.getOne(commentsBrewery_id)
  .then((commentsBrewery) => {
    if(commentsBrewery === undefined || commentsBrewery === null)
      return res.status(400).json({"error": true, "message": "Le commentaire n'existe pas"});
    return res.status(200).json({"error": false, "commentsBrewery": commentsBrewery});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du commentaire"});
  });
});

/**
@api {put} commentsBrewerys/update/:commentsBrewery_id update commentsBrewery
* @apiGroup CommentsBrewerys
* @apiHeader {String} x-access-token
* @apiParam {String} text obligatoire
* @apiParamExample {json} Input
*  {
*     "text": "J'adore cette brasserie",
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
commentsBreweryRouter.put('/update/:commentsBrewery_id', isAuthenticatedCommentsBrewery, function(req, res){
  const commentsBrewery_id = req.params.commentsBrewery_id;
  const text = req.body.text;

  asyncLib.waterfall([
    function(done){
      CommentsBreweryController.getOne(commentsBrewery_id)
      .then((commentsBrewery) => {
        if(commentsBrewery === null || commentsBrewery === undefined)
          return res.status(400).json({"error": true, "message": "Le commentaire n'existe pas"});
        done(null, commentsBrewery);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du commentaire"});
      });
    },
    function(commentsBrewery, done){
      CommentsBreweryController.update(commentsBrewery, text)
      .then((commentsBrewery) => {
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
@api {delete} commentsBrewerys/delete/:commentsBrewery_id delete commentsBrewery
* @apiGroup CommentsBrewerys
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
commentsBreweryRouter.delete('/delete/:commentsBrewery_id', isAuthenticatedCommentsBrewery, function(req, res){
  const commentsBrewery_id = req.params.commentsBrewery_id;

  asyncLib.waterfall([
    function(done){
      CommentsBreweryController.getOne(commentsBrewery_id)
      .then((commentsBrewery) => {
        if(commentsBrewery === null || commentsBrewery === undefined){
          return res.status(400).json({"error": true, "message": "Le commentaire n'existe pas"});
        }
        done(null, commentsBrewery);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du commentaire"});
      });
    },
    function(commentsBrewery, done){
      CommentsBreweryController.delete(commentsBrewery);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


module.exports = commentsBreweryRouter;
