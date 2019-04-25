const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path')
const picturesBreweryRouter = express.Router();
const BreweryController = controllers.BreweryController;

const PicturesBreweryController = controllers.PicturesBreweryController;
picturesBreweryRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedUserCreateBrewery(req, res, next) {
  const token = req.headers['x-access-token'];
  const brewery_id = req.body.brewery_id;

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  BreweryController.getOne(brewery_id)
  .then((brewery) => {
    if(brewery === null || brewery === undefined)
      return res.status(400).json({"error": true, "message": "La brasserie n'existe pas"});
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != brewery.user_id) && decoded.admin != 1)
        return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
      next();
    });
  }).catch((err) => {
      return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la brasserie"});
  });
}

function isAuthenticatedUserBrewery(req, res, next) {
  const token = req.headers['x-access-token'];
  const picturesBrewery_id = req.params.picturesBrewery_id;

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  asyncLib.waterfall([
    function(done){
      PicturesBreweryController.getOne(picturesBrewery_id)
      .then((picturesBrewery) => {
        if(picturesBrewery === null || picturesBrewery === undefined)
          return res.status(400).json({"error": true, "message": "L'image n'existe pas"});
        else
          done(null, picturesBrewery);
      }).catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'image"});
      });
    },
    function(picturesBrewery, done){
      BreweryController.getOne(picturesBrewery.brewery_id)
      .then((brewery) => {
        if(brewery === null || brewery === undefined)
          return res.status(400).json({"error": true, "message": "La brasserie n'existe pas"});
        jwt.verify(token, auth.secret, function(err, decoded) {
          if (err)
            return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
          if ((decoded.id != brewery.user_id) && decoded.admin != 1)
            return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
          next();
        });
      }).catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la brasserie"});
      });
    }
  ]);
}

picturesBreweryRouter.use(fileUpload());

/**
@api {post} picturesBrewerys/create add a new picture to brewery
* @apiGroup PicturesBrewerys
* @apiHeader {String} x-access-token
* @apiParam {File} file Obligatoire, format png ou jpg
* @apiParam {String} brewery_id
* @apiParamExample {json} Input
*  {
*    "brewery_id": 1
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
picturesBreweryRouter.post('/create', isAuthenticatedUserCreateBrewery, function(req, res) {
  const brewery_id = req.body.brewery_id;
  const fileToUpload = req.files.file;

  const ext = fileToUpload.name.substr(fileToUpload.name.lastIndexOf('.') + 1).toLowerCase();
  const regex = new RegExp(' ','g');
  var src_tracks = brewery_id+"."+ext;
  src_tracks = src_tracks.replace(regex, '_');

  asyncLib.waterfall([
    function(done){
      BreweryController.getOne(brewery_id)
      .then((brewery) => {
        if(brewery === null || brewery === undefined)
          return res.status(400).json({"error": true, "message": "La brasserie n'existe pas"});
        done(null, brewery);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la brasserie"});
      });
    },
    function(brewery, done){
      PicturesBreweryController.add(src_tracks, brewery_id)
      .then((picturesBrewery) => {
        done(null, brewery, picturesBrewery);
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la création de l'image pour la brasserie"});
      });
    },
    function(brewery, picturesBrewery, done){
      var src_tracks = brewery_id+""+picturesBrewery.id+"."+ext;
      src_tracks = src_tracks.replace(regex, '_');
      if(fileToUpload === undefined)
        return res.status(400).json({"error": true, "message": "Aucune image à upload"}).end();
      if(ext != "png" && ext != "jpg")
        return res.status(400).json({"error": true, "message": "Format de l'image non géré (png et jpg)"}).end();

      fileToUpload.mv("medias/brewerys/"+src_tracks, function(err) {
        if (err)
          return res.status(400).json({"error": true, "message": "Erreur lors de l'upload"});
        else
          done(null, brewery, picturesBrewery, src_tracks);
      });
    },
    function(brewery, picturesBrewery, src_tracks, done){
      PicturesBreweryController.update(picturesBrewery, src_tracks)
      .then((picturesBrewery) => {
        return res.status(201).json({"error": false, "picturesBrewery": picturesBrewery});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la création de l'image pour la brasserie"});
      });
    }
  ])
});


/**
  @api {get} picturesBrewerys/download/:picturesBrewery_id download picture brewery
* @apiGroup PicturesBrewery
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
picturesBreweryRouter.get('/download/:picturesBrewery_id', isAuthenticatedUserBrewery, function(req, res){
  const picturesBrewery_id = req.params.picturesBrewery_id;
  var pathPicturesBrewerysDefault = path.resolve( __dirname+"/../../medias/picturesBrewerys/");

  PicturesBreweryController.getOne(picturesBrewery_id)
  .then((picturesBrewery) => {
    if(picturesBrewery === null || picturesBrewery === undefined)
      return res.status(401).json({"error": true, "message": "L'image de la brasserie n'existe pas"});
    pathPicturesBrewerys = pathPicturesBrewerysDefault + "\\" + picturesBrewery.pathPicture;

    if (fs.existsSync(pathPicturesBrewerys)){
      const buffer = new Buffer(fs.readFileSync(pathPicturesBrewerys), 'base64');
      res.writeHead(200, {
       'Content-Type': 'image/jpeg',
       'Content-Length': buffer.length
     });
     res.end(buffer);
    }else{
      const buffer = new Buffer(fs.readFileSync(pathPicturesBrewerysDefault + "\\" + 'defaultprofile.png'), 'base64');
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
@api {delete} picturesBrewerys/delete/:picturesBrewery_id delete picturesBrewery
* @apiGroup PicturesBrewerys
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
picturesBreweryRouter.delete('/delete/:picturesBrewery_id', isAuthenticatedUserBrewery, function(req, res){
  const picturesBrewery_id = req.params.picturesBrewery_id;

  asyncLib.waterfall([
    function(done){
      PicturesBreweryController.getOne(picturesBrewery_id)
      .then((picturesBrewery) => {
        if(picturesBrewery === null || picturesBrewery === undefined){
          return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"});
        }
        done(null, picturesBrewery);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"});
      });
    },
    function(picturesBrewery, done){
      var pathPicturesBrewerysDefault = path.resolve( __dirname+"/../../medias/picturesBrewerys/");
      fr.unlink(pathPicturesBrewerysDefault + "\\" + picturesBrewery.pathPicture, function(err) {
        if (err)
          return res.status(400).json({"error": true, "message": "Erreur lors de la suppression de l'image"});
        else
          done(null, picturesBrewery);
      });
    },
    function(picturesBrewery, done){
      PicturesBreweryController.delete(picturesBrewery);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});

module.exports = picturesBreweryRouter;
