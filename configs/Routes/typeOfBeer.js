const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const TypeOfBeerController = controllers.TypeOfBeerController;
const UserController = controllers.UserController;
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path')

const typeOfBeerRouter = express.Router();
typeOfBeerRouter.use(bodyParser.json({limit: '10mb'}));


function isAdmin(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"}).end();

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"}).end();
    if (decoded.admin != 1)
      return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"}).end();
    next();
  });
}

/**
@api {post} typeOfBeers/create add a new type of beer
* @apiGroup TypeOfBeers
* @apiHeader {String} x-access-token
* @apiParam {String} name obligatoire, unique et entre 2 à 200 caractères
* @apiParamExample {json} Input
*  {
*    "name": "Blonde"
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
*        "message": "Erreur lors de la création du type de bière"
*    }
*/
typeOfBeerRouter.post('/create', isAdmin, function(req, res) {
  const name = req.body.name;

  TypeOfBeerController.add(name)
  .then((typeOfBeer) => {
    return res.status(201).json({"error": false});
  })
  .catch((err) => {
    if(err.errors)
      return res.status(400).json({"error": true, "message": err.errors[0].message});
    return res.status(500).json({"error": true, "message": "Erreur lors de la création du type de bière"}).end();
  });
});


/**
@api {get} typeOfBeers/?name=name get all type of beer
* @apiGroup TypeOfBeers
* @apiParam {String} name
* @apiSuccessExample {json}
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "name": "Blonde",
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
*        "message": "Aucun type de bière trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération des types de bières"
*    }
*/
typeOfBeerRouter.get('/', function(req, res) {
  const name = req.query.name;

  TypeOfBeerController.getAll(name)
  .then((typeOfBeers) => {
    if(typeOfBeers.length == 0)
      return res.status(400).json({"error": true, "message": "Aucun type de bière trouvé"}).end();
    return res.status(200).json({"error": false, "typeOfBeer": typeOfBeers});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des types de bières"}).end();
  });
});


/**
@api {get} typeOfBeers/:typeOfBeer_id get type of beer
* @apiGroup TypeOfBeers
* @apiSuccessExample {json}
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*        "id": 1,
*        "name": "Blonde",
*        "created_at": "2019-04-14T13:42:47.000Z",
*        "updated_at": "2019-04-14T13:42:47.000Z",
*        "deleted_at": null
*    }
* }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "Le type de bière n'existe pas"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération du type de bière"
*    }
*/
typeOfBeerRouter.get('/:typeOfBeer_id', function(req, res) {
  const typeOfBeer_id = req.params.typeOfBeer_id;

  TypeOfBeerController.getOne(typeOfBeer_id)
  .then((typeOfBeer) => {
    if(typeOfBeer === undefined || typeOfBeer === null)
      return res.status(400).json({"error": true, "message": "Le type de bière n'existe pas"}).end();
    return res.status(200).json({"error": false, "typeOfBeer": typeOfBeer});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du type de bière"}).end();
  });
});


/**
@api {put} typeOfBeers/update/:typeOfBeer_id update type of beer
* @apiGroup TypeOfBeers
* @apiHeader {String} x-access-token
* @apiParam {String} name unique et entre 2 à 200 caractères
* @apiParamExample {json} Input
*  {
*    "name": "Brune"
*  }
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Success
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
typeOfBeerRouter.put('/update/:typeOfBeer_id', isAdmin, function(req, res){
  const typeOfBeer_id = req.params.typeOfBeer_id;
  const name = req.body.name;

  asyncLib.waterfall([
    function(done){
      TypeOfBeerController.getOne(typeOfBeer_id)
      .then((typeOfBeer) => {
        if(typeOfBeer === null || typeOfBeer === undefined)
          return res.status(400).json({"error": true, "message": "Le type de bière n'existe pas"}).end();
        done(null, typeOfBeer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du type de bière"}).end();
      });
    },
    function(typeOfBeer, done){
      TypeOfBeerController.update(typeOfBeer, name)
      .then((typeOfBeer) => {
        return res.status(200).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour du type de bière"}).end();
      });
    }
  ]);
});


/**
@api {delete} typeOfBeers/delete/:typeOfBeer_id delete type of beer
* @apiGroup TypeOfBeers
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
*        "message": "Le type de bière n'existe pas"
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
*        "message": "Erreur lors de la récupération du type de bières"
*    }
*/
typeOfBeerRouter.delete('/delete/:typeOfBeer_id', isAdmin, function(req, res){
  const typeOfBeer_id = req.params.typeOfBeer_id;

  asyncLib.waterfall([
    function(done){
      TypeOfBeerController.getOne(typeOfBeer_id)
      .then((typeOfBeer) => {
        if(typeOfBeer === null || typeOfBeer === undefined){
          return res.status(400).json({"error": true, "message": "Le type de bière n'existe pas"}).end();
        }
        done(null, typeOfBeer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du type de bière"}).end();
      });
    },
    function(typeOfBeer, done){
      TypeOfBeerController.delete(typeOfBeer);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});

typeOfBeerRouter.use(fileUpload());
/**
@api {put} typeOfBeers/upload/:typeOfBeer_id upload picture typeOfBeer
* @apiGroup TypeOfBeers
* @apiHeader {String} x-access-token
* @apiParam {File} file Obligatoire, format png ou jpg
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
typeOfBeerRouter.put('/upload/:typeOfBeer_id', isAdmin, function(req, res) {
  const typeOfBeer_id = req.params.typeOfBeer_id;
  const fileToUpload = req.files.file;
  asyncLib.waterfall([
    function(done){
      TypeOfBeersController.getOne(typeOfBeer_id)
      .then((typeOfBeer) => {
        if(typeOfBeer === null || typeOfBeer === undefined)
          return res.status(400).json({"error": true, "message": "Le type de bière n'existe pas"});
        done(null, typeOfBeer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du type de bière"});
      });
    },
    function(typeOfBeer, done){
      const ext = fileToUpload.name.substr(fileToUpload.name.lastIndexOf('.') + 1).toLowerCase();
      const regex = new RegExp(' ','g');
      var src_tracks = typeOfBeer.id+"."+ext;
      src_tracks = src_tracks.replace(regex, '_');

      if(fileToUpload === undefined)
        return res.status(400).json({"error": true, "message": "Aucune image à upload"}).end();
      if(ext != "png" && ext != "jpg")
        return res.status(400).json({"error": true, "message": "Format de l'image non géré (png et jpg)"}).end();

      fileToUpload.mv("medias/typeOfBeers/"+src_tracks, function(err) {
        if (err)
          return res.status(400).json({"error": true, "message": "Erreur lors de l'upload"});
        else
          done(null, typeOfBeer, src_tracks);
      });
    },
    function(typeOfBeer, src_tracks, done){
      TypeOfBeerController.update(typeOfBeer, undefined, undefined, undefined, undefined, src_tracks)
      .then((track) => {
        return res.status(201).json({"error": false});
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la sauvegarde du chemin"});
      });
    }
  ])
});

/**
  @api {get} typeOfBeers/download/:typeOfBeer_id download picture typeOfBeer
* @apiGroup TypeOfBeers
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
typeOfBeerRouter.get('/download/:typeOfBeer_id', isAdmin, function(req, res){
  const typeOfBeer_id = req.params.typeOfBeer_id;
  var pathTypeOfBeersDefault = path.resolve( __dirname+"/../../medias/typeOfBeers/");

  TypeOfBeerController.getOne(typeOfBeer_id)
  .then((typeOfBeer) => {
    if(typeOfBeer === null || typeOfBeer === undefined)
      return res.status(401).json({"error": true, "message": "Le type de bière n'existe pas"});
    pathTypeOfBeers = pathTypeOfBeersDefault + "\\" + typeOfBeer.pathPicture;

    if (fs.existsSync(pathTypeOfBeers)){
      const buffer = new Buffer(fs.readFileSync(pathTypeOfBeers), 'base64');
      res.writeHead(200, {
       'Content-Type': 'image/jpeg',
       'Content-Length': buffer.length
     });
     res.end(buffer);
    }else{
      const buffer = new Buffer(fs.readFileSync(pathTypeOfBeersDefault + "\\" + 'defaultprofile.png'), 'base64');
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

module.exports = typeOfBeerRouter;
