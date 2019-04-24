const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const NotesBarController = controllers.NotesBarController;
const BarController = controllers.BarController;

const notesBarRouter = express.Router();
notesBarRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedNotesBarCreate(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    next();
  });
}

function isAuthenticatedNotesBar(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  NotesBarController.getOne(req.params.notesBar_id)
  .then((notesBar) => {
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != notesBar.user_id) && decoded.admin != 1)
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
@api {post} notesBars/create add a new notesBar
* @apiGroup NotesBars
* @apiHeader {String} x-access-token
* @apiParam {String} note obligatoire
* @apiParam {Int} bar_id obligatoire
* @apiParamExample {json} Input
*  {
*    "note": 15,
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
*        "message": "Erreur lors de la création de votre note"
*    }
*/
notesBarRouter.post('/create', isAuthenticatedNotesBarCreate, function(req, res) {

  const note = req.body.note;
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
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
      });
    },
    function(bar, done){
      NotesBarController.add(note, getUserIdHeader(req), bar.id)
      .then((notesBar) => {
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
@api {get} notesBars/?bar_id=bar_id&user_id=user_id get all notesBars
* @apiGroup NotesBars
* @apiParam {String} bar_id
* @apiParam {String} user_id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "note": 15,
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
*        "message": "Aucune note trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération des notes"
*    }
*/
notesBarRouter.get('/', function(req, res) {

  const bar_id = req.query.bar_id;
  const user_id = req.query.user_id;

  NotesBarController.getAll(user_id, bar_id)
  .then((notesBars) => {
    if(notesBars.length == 0)
      return res.status(400).json({"error": true, "message": "Aucune note trouvé"});
    return res.status(200).json({"error": false, "notesBar": notesBars});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des notes"});
  });
});

/**
@api {get} notesBars/:notesBar_id get notesBar
* @apiGroup NotesBars
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*            "id": 1,
*            "note": 15,
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
*        "message": "La note n'existe pas"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération de la note"
*    }
*/
notesBarRouter.get('/:notesBar_id', function(req, res) {
  const notesBar_id = req.params.notesBar_id;

  NotesBarController.getOne(notesBar_id)
  .then((notesBar) => {
    if(notesBar === undefined || notesBar === null)
      return res.status(400).json({"error": true, "message": "La note n'existe pas"});
    return res.status(200).json({"error": false, "notesBar": notesBar});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
  });
});

/**
@api {put} notesBars/update/:notesBar_id update notesBar
* @apiGroup NotesBars
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
notesBarRouter.put('/update/:notesBar_id', isAuthenticatedNotesBar, function(req, res){
  const notesBar_id = req.params.notesBar_id;
  const note = req.body.note;

  asyncLib.waterfall([
    function(done){
      NotesBarController.getOne(notesBar_id)
      .then((notesBar) => {
        if(notesBar === null || notesBar === undefined)
          return res.status(400).json({"error": true, "message": "La note n'existe pas"});
        done(null, notesBar);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
      });
    },
    function(notesBar, done){
      NotesBarController.update(notesBar, note)
      .then((notesBar) => {
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
@api {delete} notesBars/delete/:notesBar_id delete notesBar
* @apiGroup NotesBars
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
notesBarRouter.delete('/delete/:notesBar_id', isAuthenticatedNotesBar, function(req, res){
  const notesBar_id = req.params.notesBar_id;

  asyncLib.waterfall([
    function(done){
      NotesBarController.getOne(notesBar_id)
      .then((notesBar) => {
        if(notesBar === null || notesBar === undefined){
          return res.status(400).json({"error": true, "message": "La note n'existe pas"});
        }
        done(null, notesBar);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
      });
    },
    function(notesBar, done){
      NotesBarController.delete(notesBar);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


module.exports = notesBarRouter;
