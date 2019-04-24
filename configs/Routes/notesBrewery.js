const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const NotesBreweryController = controllers.NotesBreweryController;
const BreweryController = controllers.BreweryController;

const notesBreweryRouter = express.Router();
notesBreweryRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedNotesBreweryCreate(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    next();
  });
}

function isAuthenticatedNotesBrewery(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  NotesBreweryController.getOne(req.params.notesBrewery_id)
  .then((notesBrewery) => {
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != notesBrewery.user_id) && decoded.admin != 1)
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
@api {post} notesBrewerys/create add a new notesBrewery
* @apiGroup NotesBrewerys
* @apiHeader {String} x-access-token
* @apiParam {String} note obligatoire
* @apiParam {Int} brewery_id obligatoire
* @apiParamExample {json} Input
*  {
*    "note": 15,
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
*        "message": "Erreur lors de la création de votre note"
*    }
*/
notesBreweryRouter.post('/create', isAuthenticatedNotesBreweryCreate, function(req, res) {

  const note = req.body.note;
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
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
      });
    },
    function(brewery, done){
      NotesBreweryController.add(note, getUserIdHeader(req), brewery.id)
      .then((notesBrewery) => {
        return res.status(201).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la création de votre note"});
      });
    }
  ]);
});

/**
@api {get} notesBrewerys/?brewery_id=brewery_id&user_id=user_id get all notesBrewerys
* @apiGroup NotesBrewerys
* @apiParam {String} brewery_id
* @apiParam {String} user_id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "note": 15,
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
*        "message": "Aucune note trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération des notes"
*    }
*/
notesBreweryRouter.get('/', function(req, res) {

  const brewery_id = req.query.brewery_id;
  const user_id = req.query.user_id;

  NotesBreweryController.getAll(user_id, brewery_id)
  .then((notesBrewerys) => {
    if(notesBrewerys.length == 0)
      return res.status(400).json({"error": true, "message": "Aucune note trouvé"});
    return res.status(200).json({"error": false, "notesBrewery": notesBrewerys});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des notes"});
  });
});

/**
@api {get} notesBrewerys/:notesBrewery_id get notesBrewery
* @apiGroup NotesBrewerys
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*            "id": 1,
*            "note": 15,
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
*        "message": "La note n'existe pas"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération de la note"
*    }
*/
notesBreweryRouter.get('/:notesBrewery_id', function(req, res) {
  const notesBrewery_id = req.params.notesBrewery_id;

  NotesBreweryController.getOne(notesBrewery_id)
  .then((notesBrewery) => {
    if(notesBrewery === undefined || notesBrewery === null)
      return res.status(400).json({"error": true, "message": "La note n'existe pas"});
    return res.status(200).json({"error": false, "notesBrewery": notesBrewery});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
  });
});

/**
@api {put} notesBrewerys/update/:notesBrewery_id update notesBrewery
* @apiGroup NotesBrewerys
* @apiHeader {String} x-access-token
* @apiParam {String} note obligatoire
* @apiParamExample {json} Input
*  {
*     "note": 15,
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
notesBreweryRouter.put('/update/:notesBrewery_id', isAuthenticatedNotesBrewery, function(req, res){
  const notesBrewery_id = req.params.notesBrewery_id;
  const note = req.body.note;

  asyncLib.waterfall([
    function(done){
      NotesBreweryController.getOne(notesBrewery_id)
      .then((notesBrewery) => {
        if(notesBrewery === null || notesBrewery === undefined)
          return res.status(400).json({"error": true, "message": "La note n'existe pas"});
        done(null, notesBrewery);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
      });
    },
    function(notesBrewery, done){
      NotesBreweryController.update(notesBrewery, note)
      .then((notesBrewery) => {
        return res.status(200).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour de la note"});
      });
    }
  ]);
});

/**
@api {delete} notesBrewerys/delete/:notesBrewery_id delete notesBrewery
* @apiGroup NotesBrewerys
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
*        "message": "La note n'existe pas"
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
*        "message": "Erreur lors de la récupération de la note"
*    }
*/
notesBreweryRouter.delete('/delete/:notesBrewery_id', isAuthenticatedNotesBrewery, function(req, res){
  const notesBrewery_id = req.params.notesBrewery_id;

  asyncLib.waterfall([
    function(done){
      NotesBreweryController.getOne(notesBrewery_id)
      .then((notesBrewery) => {
        if(notesBrewery === null || notesBrewery === undefined){
          return res.status(400).json({"error": true, "message": "La note n'existe pas"});
        }
        done(null, notesBrewery);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
      });
    },
    function(notesBrewery, done){
      NotesBreweryController.delete(notesBrewery);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


module.exports = notesBreweryRouter;
