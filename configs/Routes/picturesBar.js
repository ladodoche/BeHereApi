const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path')
const picturesBarRouter = express.Router();
const BarController = controllers.BarController;

const PicturesBarController = controllers.PicturesBarController;
picturesBarRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedUserCreateBar(req, res, next) {
  const token = req.headers['x-access-token'];
  const bar_id = req.body.bar_id;

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  BarController.getOne(bar_id)
  .then((bar) => {
    if(bar === null || bar === undefined)
      return res.status(400).json({"error": true, "message": "Le bar n'existe pas"});
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != bar.user_id) && decoded.admin != 1)
        return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
      next();
    });
  }).catch((err) => {
      return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du bar"});
  });
}

function isAuthenticatedUserBar(req, res, next) {
  const token = req.headers['x-access-token'];
  const picturesBar_id = req.params.picturesBar_id;

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  asyncLib.waterfall([
    function(done){
      PicturesBarController.getOne(picturesBar_id)
      .then((picturesBar) => {
        if(picturesBar === null || picturesBar === undefined)
          return res.status(400).json({"error": true, "message": "L'image n'existe pas"});
        else
          done(null, picturesBar);
      }).catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'image"});
      });
    },
    function(picturesBar, done){
      BarController.getOne(picturesBar.bar_id)
      .then((bar) => {
        if(bar === null || bar === undefined)
          return res.status(400).json({"error": true, "message": "Le bar n'existe pas"});
        jwt.verify(token, auth.secret, function(err, decoded) {
          if (err)
            return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
          if ((decoded.id != bar.user_id) && decoded.admin != 1)
            return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
          next();
        });
      }).catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du bar"});
      });
    }
  ]);
}


picturesBarRouter.use(fileUpload());
/**
@api {post} picturesBars/create add a new picture to bar
* @apiGroup PicturesBars
* @apiHeader {String} x-access-token
* @apiParam {File} file Obligatoire, format png ou jpg
* @apiParam {String} bar_id
* @apiParamExample {json} Input
*  {
*    "bar_id": 1
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
*        "message": message
*    }
*/
picturesBarRouter.post('/create', isAuthenticatedUserCreateBar, function(req, res) {
  const bar_id = req.body.bar_id;
  const fileToUpload = req.files.file;

  const ext = fileToUpload.name.substr(fileToUpload.name.lastIndexOf('.') + 1).toLowerCase();
  const regex = new RegExp(' ','g');
  var src_tracks = bar_id+"."+ext;
  src_tracks = src_tracks.replace(regex, '_');

  asyncLib.waterfall([
    function(done){
      BarController.getOne(bar_id)
      .then((bar) => {
        if(bar === null || bar === undefined)
          return res.status(400).json({"error": true, "message": "Le bar n'existe pas"});
        done(null, bar);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du bar"});
      });
    },
    function(bar, done){
      PicturesBarController.add(src_tracks, bar_id)
      .then((picturesBar) => {
        done(null, bar, picturesBar);
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la création de l'image pour le bar"});
      });
    },
    function(bar, picturesBar, done){
      var src_tracks = bar_id+""+picturesBar.id+"."+ext;
      src_tracks = src_tracks.replace(regex, '_');
      if(fileToUpload === undefined)
        return res.status(400).json({"error": true, "message": "Aucune image à upload"}).end();
      if(ext != "png" && ext != "jpg")
        return res.status(400).json({"error": true, "message": "Format de l'image non géré (png et jpg)"}).end();

      fileToUpload.mv("medias/bars/"+src_tracks, function(err) {
        if (err)
          return res.status(400).json({"error": true, "message": "Erreur lors de l'upload"});
        else
          done(null, bar, picturesBar, src_tracks);
      });
    },
    function(bar, picturesBar, src_tracks, done){
      PicturesBarController.update(picturesBar, src_tracks)
      .then((picturesBar) => {
        return res.status(201).json({"error": false, "picturesBar": picturesBar});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la création de l'image pour le bar"});
      });
    }
  ])
});


/**
  @api {get} picturesBars/download/:picturesBar_id download picture bar
* @apiGroup PicturesBar
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Success
*    {
*        "error": false,
*        "buffer": buffer
*    }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
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
picturesBarRouter.get('/download/:picturesBar_id', isAuthenticatedUserBar, function(req, res){
  const picturesBar_id = req.params.picturesBar_id;
  var pathPicturesBarsDefault = path.resolve( __dirname+"/../../medias/picturesBars/");

  PicturesBarController.getOne(picturesBar_id)
  .then((picturesBar) => {
    if(picturesBar === null || picturesBar === undefined)
      return res.status(401).json({"error": true, "message": "L'image du bar n'existe pas"});
    pathPicturesBars = pathPicturesBarsDefault + "\\" + picturesBar.pathPicture;

    if (fs.existsSync(pathPicturesBars)){
      const buffer = new Buffer(fs.readFileSync(pathPicturesBars), 'base64');
      res.writeHead(200, {
       'Content-Type': 'image/jpeg',
       'Content-Length': buffer.length
     });
     res.end(buffer);
    }else{
      const buffer = new Buffer(fs.readFileSync(pathPicturesBarsDefault + "\\" + 'defaultprofile.png'), 'base64');
      res.writeHead(200, {
       'Content-Type': 'image/png',
       'Content-Length': buffer.length
     });
     res.end(buffer);

  }})
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Image non trouvé sur notre serveur"});
  });
})

/**
@api {delete} picturesBars/delete/:picturesBar_id delete picturesBar
* @apiGroup PicturesBars
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
*        "message": "L'utilisateur n'existe pas"
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
*        "message": "Erreur lors de la récupération de l'utilisateurs"
*    }
*/
picturesBarRouter.delete('/delete/:picturesBar_id', isAuthenticatedUserBar, function(req, res){
  const picturesBar_id = req.params.picturesBar_id;

  asyncLib.waterfall([
    function(done){
      PicturesBarController.getOne(picturesBar_id)
      .then((picturesBar) => {
        if(picturesBar === null || picturesBar === undefined){
          return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"});
        }
        done(null, picturesBar);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"});
      });
    },
    function(picturesBar, done){
      var pathPicturesBarsDefault = path.resolve( __dirname+"/../../medias/picturesBars/");
      fr.unlink(pathPicturesBarsDefault + "\\" + picturesBar.pathPicture, function(err) {
        if (err)
          return res.status(400).json({"error": true, "message": "Erreur lors de la suppression de l'image"});
        else
          done(null, picturesBar);
      });
    },
    function(picturesBar, done){
      PicturesBarController.delete(picturesBar);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});

module.exports = picturesBarRouter;
