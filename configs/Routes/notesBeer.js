const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const NotesBeerController = controllers.NotesBeerController;
const BeerController = controllers.BeerController;

const notesBeerRouter = express.Router();
notesBeerRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedNotesBeerCreate(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    next();
  });
}

function isAuthenticatedNotesBeer(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  NotesBeerController.getOne(req.params.notesBeer_id)
  .then((notesBeer) => {
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != notesBeer.user_id) && decoded.admin != 1)
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
@api {post} notesBeers/create add a new notesBeer
* @apiGroup NotesBeers
* @apiHeader {String} x-access-token
* @apiParam {String} note obligatoire
* @apiParam {Int} beer_id obligatoire
* @apiParamExample {json} Input
*  {
*    "note": "J'adore cette bière",
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
*        "message": "Erreur lors de la création de votre note"
*    }
*/
notesBeerRouter.post('/create', isAuthenticatedNotesBeerCreate, function(req, res) {

  const note = req.body.note;
  const beer_id = req.body.beer_id;

  asyncLib.waterfall([
    function(done){
      BeerController.getOne(beer_id)
      .then((beer) => {
        if(beer === null || beer === undefined)
          return res.status(400).json({"error": true, "message": "La bière n'existe pas"});
        done(null, beer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
      });
    },
    function(beer, done){
      NotesBeerController.add(note, getUserIdHeader(req), beer.id)
      .then((notesBeer) => {
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
@api {get} notesBeers/?beer_id=beer_id&user_id=user_id get all notesBeers
* @apiGroup NotesBeers
* @apiParam {String} beer_id
* @apiParam {String} user_id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "note": "J'adore cette bière",
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
*        "message": "Aucune note trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération des notes"
*    }
*/
notesBeerRouter.get('/', function(req, res) {

  const beer_id = req.query.beer_id;
  const user_id = req.query.user_id;

  NotesBeerController.getAll(user_id, beer_id)
  .then((notesBeers) => {
    if(notesBeers.length == 0)
      return res.status(400).json({"error": true, "message": "Aucune note trouvé"});
    return res.status(200).json({"error": false, "notesBeer": notesBeers});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des notes"});
  });
});

/**
@api {get} notesBeers/:notesBeer_id get notesBeer
* @apiGroup NotesBeers
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*            "id": 1,
*            "note": "J'adore cette bière",
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
*        "message": "La note n'existe pas"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération de la note"
*    }
*/
notesBeerRouter.get('/:notesBeer_id', function(req, res) {
  const notesBeer_id = req.params.notesBeer_id;

  NotesBeerController.getOne(notesBeer_id)
  .then((notesBeer) => {
    if(notesBeer === undefined || notesBeer === null)
      return res.status(400).json({"error": true, "message": "La note n'existe pas"});
    return res.status(200).json({"error": false, "notesBeer": notesBeer});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
  });
});

/**
@api {put} notesBeers/update/:notesBeer_id update notesBeer
* @apiGroup NotesBeers
* @apiHeader {String} x-access-token
* @apiParam {String} note obligatoire
* @apiParamExample {json} Input
*  {
*     "note": "J'adore cette bière",
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
notesBeerRouter.put('/update/:notesBeer_id', isAuthenticatedNotesBeer, function(req, res){
  const notesBeer_id = req.params.notesBeer_id;
  const note = req.body.note;

  asyncLib.waterfall([
    function(done){
      NotesBeerController.getOne(notesBeer_id)
      .then((notesBeer) => {
        if(notesBeer === null || notesBeer === undefined)
          return res.status(400).json({"error": true, "message": "La note n'existe pas"});
        done(null, notesBeer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
      });
    },
    function(notesBeer, done){
      NotesBeerController.update(notesBeer, note)
      .then((notesBeer) => {
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
@api {delete} notesBeers/delete/:notesBeer_id delete notesBeer
* @apiGroup NotesBeers
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
notesBeerRouter.delete('/delete/:notesBeer_id', isAuthenticatedNotesBeer, function(req, res){
  const notesBeer_id = req.params.notesBeer_id;

  asyncLib.waterfall([
    function(done){
      NotesBeerController.getOne(notesBeer_id)
      .then((notesBeer) => {
        if(notesBeer === null || notesBeer === undefined){
          return res.status(400).json({"error": true, "message": "La note n'existe pas"});
        }
        done(null, notesBeer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
      });
    },
    function(notesBeer, done){
      NotesBeerController.delete(notesBeer);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


module.exports = notesBeerRouter;
