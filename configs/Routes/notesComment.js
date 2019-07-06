const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const UserController = controllers.UserController;
const NotesCommentController = controllers.NotesCommentController;
const CommentsBarController = controllers.CommentsBarController;
const CommentsBreweryController = controllers.CommentsBreweryController;
const CommentsBeerController = controllers.CommentsBeerController;
const CommentsUserController = controllers.CommentsUserController;

const notesCommentRouter = express.Router();
notesCommentRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedNotesCommentCreate(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    next();
  });
}

function isAuthenticatedNotesComment(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  NotesCommentController.getOne(req.params.notesComment_id)
  .then((notesComment) => {
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != notesComment.user_id) && decoded.admin != 1)
        return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
      next();
    });
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
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
@api {post} notesComments/create add a new notesComment
* @apiGroup NotesComments
* @apiHeader {String} x-access-token
* @apiParam {Int} note obligatoire
* @apiParam {Int} commentsBar_id
* @apiParam {Int} commentsBeer_id
* @apiParam {Int} commentsBrewery_id
* @apiParam {Int} commentsUser_id
* @apiParamExample {json} Input
*  {
*    "note": 5,
*    "commentsBar_id": 1
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
notesCommentRouter.post('/create', isAuthenticatedNotesCommentCreate, function(req, res) {

  const note = req.body.note;
  const commentsBar_id = req.body.commentsBar_id;
  const commentsBeer_id = req.body.commentsBeer_id;
  const commentsBrewery_id = req.body.commentsBrewery_id;
  const commentsUser_id = req.body.commentsUser_id;

  if((commentsBar_id != null || commentsBar_id != undefined)
      && (commentsBeer_id != null || commentsBeer_id != undefined)
      && (commentsBrewery_id != null || commentsBrewery_id != undefined)
      && (commentsUser_id != null || commentsUser_id != undefined)){
    return res.status(400).json({"error": true, "message": "erreur"});
  }else if(commentsBar_id != null || commentsBar_id != undefined){
    asyncLib.waterfall([
      function(done){
        UserController.getOne(getUserIdHeader(req))
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
        NotesCommentController.getAll(getUserIdHeader(req), commentsBar_id)
        .then((note) => {
          if(note.length != 0)
            return res.status(400).json({"error": true, "message": "Vous avez deja noté ce commentaire"});
          done(null, note);
        })
        .catch((err) => {
            return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
        });
      },
      function(user, done){
        NotesCommentController.add(note, getUserIdHeader(req), commentsBar_id)
        .then((notesComment) => {
          return res.status(201).json({"error": false});
        })
        .catch((err) => {
          if(err.errors)
            return res.status(400).json({"error": true, "message": err.errors[0].message});
          return res.status(500).json({"error": true, "message": "Erreur lors de la création de la note"});
        });
      }
    ]);
  }else if(commentsBeer_id != null || commentsBeer_id != undefined){
    asyncLib.waterfall([
      function(done){
        UserController.getOne(getUserIdHeader(req))
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
        NotesCommentController.getAll(getUserIdHeader(req), undefined, commentsBeer_id)
        .then((note) => {
          if(note.length != 0)
            return res.status(400).json({"error": true, "message": "Vous avez deja noté ce commentaire"});
          done(null, note);
        })
        .catch((err) => {
            return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
        });
      },
      function(user, done){
        NotesCommentController.add(note, getUserIdHeader(req), undefined, commentsBeer_id)
        .then((notesComment) => {
          return res.status(201).json({"error": false});
        })
        .catch((err) => {
          if(err.errors)
            return res.status(400).json({"error": true, "message": err.errors[0].message});
          return res.status(500).json({"error": true, "message": "Erreur lors de la création de la note"});
        });
      }
    ]);
  }else if(commentsBrewery_id != null || commentsBrewery_id != undefined){
    asyncLib.waterfall([
      function(done){
        UserController.getOne(getUserIdHeader(req))
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
        NotesCommentController.getAll(getUserIdHeader(req), undefined, undefined, commentsBrewery_id)
        .then((note) => {
          if(note.length != 0)
            return res.status(400).json({"error": true, "message": "Vous avez deja noté ce commentaire"});
          done(null, note);
        })
        .catch((err) => {
            return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
        });
      },
      function(user, done){
        NotesCommentController.add(note, getUserIdHeader(req), undefined, undefined, commentsBrewery_id)
        .then((notesComment) => {
          return res.status(201).json({"error": false});
        })
        .catch((err) => {
          if(err.errors)
            return res.status(400).json({"error": true, "message": err.errors[0].message});
          return res.status(500).json({"error": true, "message": "Erreur lors de la création de la note"});
        });
      }
    ]);

  }else if(commentsUser_id != null || commentsUser_id != undefined){
    asyncLib.waterfall([
      function(done){
        UserController.getOne(getUserIdHeader(req))
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
        NotesCommentController.getAll(getUserIdHeader(req), undefined, undefined, undefined, commentsUser_id)
        .then((note) => {
          if(note.length != 0)
            return res.status(400).json({"error": true, "message": "Vous avez deja noté ce commentaire"});
          done(null, note);
        })
        .catch((err) => {
            return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
        });
      },
      function(user, done){
        NotesCommentController.add(note, getUserIdHeader(req), undefined, undefined, undefined, commentsUser_id)
        .then((notesComment) => {
          return res.status(201).json({"error": false});
        })
        .catch((err) => {
          if(err.errors)
            return res.status(400).json({"error": true, "message": err.errors[0].message});
          return res.status(500).json({"error": true, "message": "Erreur lors de la création de la note"});
        });
      }
    ]);
  }
});

/**
@api {get} notesComments/?user_id=user_id&commentsBar_id=commentsBar_id&commentsBeer_id=commentsBeer_id&commentsBrewery_id=commentsBrewery_id&commentsUser_id=commentsUser_id get all notesComments
* @apiGroup NotesComments
* @apiParam {Int} user_id
* @apiParam {Int} commentsBar_id
* @apiParam {Int} commentsBeer_id
* @apiParam {Int} commentsBrewery_id
* @apiParam {Int} commentsUser_id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "note": 5,
*            "user_id": 1,
*            "commentsBar_id": 1,
*            "commentsBeer_id": null,
*            "commentsBrewery_id": null,
*            "commentsUser_id": null,
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
notesCommentRouter.get('/', function(req, res) {

  const user_id = req.query.user_id;
  const commentsBar_id = req.query.commentsBar_id;
  const commentsBeer_id = req.query.commentsBeer_id;
  const commentsBrewery_id = req.query.commentsBrewery_id;
  const commentsUser_id = req.query.commentsUser_id;

  NotesCommentController.getAll(user_id, commentsBar_id, commentsBrewery_id, commentsBrewery_id, commentsUser_id)
  .then((notesComments) => {
    if(notesComments.length == 0)
      return res.status(400).json({"error": true, "message": "Aucune note trouvé"});
    return res.status(200).json({"error": false, "notesComment": notesComments});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des notes"});
  });
});

/**
@api {get} notesComments/:notesComment_id get notesComment
* @apiGroup NotesComments
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*            "id": 1,
*            "note": 5,
*            "user_id": 1,
*            "commentsBar_id": 1,
*            "commentsBeer_id": null,
*            "commentsBrewery_id": null,
*            "commentsUser_id": null,
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
notesCommentRouter.get('/:notesComment_id', function(req, res) {
  const notesComment_id = req.params.notesComment_id;

  NotesCommentController.getOne(notesComment_id)
  .then((notesComment) => {
    if(notesComment === undefined || notesComment === null)
      return res.status(400).json({"error": true, "message": "La note n'existe pas"});
    return res.status(200).json({"error": false, "notesComment": notesComment});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
  });
});

/**
@api {put} notesComments/update/:notesComment_id update notesComment
* @apiGroup NotesComments
* @apiHeader {String} x-access-token
* @apiParam {String} note
* @apiParamExample {json} Input
*  {
*     "note": 5,
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
notesCommentRouter.put('/update/:notesComment_id', isAuthenticatedNotesComment, function(req, res){
  const notesComment_id = req.params.notesComment_id;
  const note = req.body.note;

  asyncLib.waterfall([
    function(done){
      NotesCommentController.getOne(notesComment_id)
      .then((notesComment) => {
        if(notesComment === null || notesComment === undefined)
          return res.status(400).json({"error": true, "message": "La note n'existe pas"});
        done(null, notesComment);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la note"});
      });
    },
    function(notesComment, done){
      NotesCommentController.update(notesComment, note)
      .then((notesComment) => {
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
@api {delete} notesComments/delete/:notesComment_id delete notesComment
* @apiGroup NotesComments
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
*        "message": "Erreur lors de la note"
*    }
*/
notesCommentRouter.delete('/delete/:notesComment_id', isAuthenticatedNotesComment, function(req, res){
  const notesComment_id = req.params.notesComment_id;

  asyncLib.waterfall([
    function(done){
      NotesCommentController.getOne(notesComment_id)
      .then((notesComment) => {
        if(notesComment === null || notesComment === undefined){
          return res.status(400).json({"error": true, "message": "La note n'existe pas"});
        }
        done(null, notesComment);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la note"});
      });
    },
    function(notesComment, done){
      NotesCommentController.delete(notesComment);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


module.exports = notesCommentRouter;
