const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const jwt = require('jsonwebtoken');
const asyncLib = require('async');
const auth = require('../auth.js');
const BeerController = controllers.BeerController;
const BreweryController = controllers.BreweryController;
const TypeOfBeerController = controllers.TypeOfBeerController;
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path')
const sha256 = require('js-sha256').sha256;

const beerRouter = express.Router();
beerRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedBeerAccountToCreate(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    if ((decoded.breweryman == false) && decoded.admin != 1)
      return res.status(401).json({ "error": true, "message": "Vous devez être brasseur pour creer une bière"});
    next();
  });
}

function isAuthenticatedBeerAccount(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    if ((decoded.id != req.params.beer_id) && decoded.admin != 1)
      return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
    next();
  });
}

/**
@api {post} beers/create add a new beer
* @apiGroup Beers
* @apiParam {String} name obligatoire et entre 2 à 200 caractères
* @apiParam {String} color obligatoire et entre 2 à 100 caractères
* @apiParam {String} origin obligatoire, entre 2 et 150 caractères, avec au moins une lettre majuscule, majuscule et un chiffre
* @apiParam {Text} description
* @apiParam {Int} type_of_beer_id
* @apiParam {Int} brewery_id obligatoire
* @apiParamExample {json} Input
*  {
*    "name": "Leffe",
*    "color": "blonde",
*    "origin": "Belgique",
*    "description": "La Leffe ou Abbaye de Leffe est une bière belge d'Abbaye reconnue, créée en 1240 par les chanoines de l'ordre de Prémontré de l'abbaye Notre-Dame de Leffe et produite par la brasserie Artois à Louvain.",
*    "type_of_beer_id": 2,
*    "brewery_id" : 1
*  }
* @apiSuccessExample {json} Success
*    HTTP/1.1 201 Created
*    {
*        "error": false,
*        "beer": {
*            "name": "Leffe",
*            "color": "blonde",
*            "origin": "Belgique",
*            "brewery_id": 1,
*            "description": "La Leffe ou Abbaye de Leffe est une bière belge d'Abbaye reconnue, créée en 1240 par les chanoines de l'ordre de Prémontré de l'abbaye Notre-Dame de Leffe et produite par la brasserie Artois à Louvain.",
*            "birthDate": "1997-05-22T00:00:00.000Z",
*            "updated_at": "2019-04-14T09:20:46.668Z",
*            "created_at": "2019-04-14T09:20:46.668Z"
*        }
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
*        "message": "Erreur lors de la création de la bière"
*    }
*/
beerRouter.post('/create', isAuthenticatedBeerAccountToCreate, function(req, res) {
  const name = req.body.name;
  const color = req.body.color;
  const origin = req.body.origin;
  const description = req.body.description;
  const type_of_beer_id = req.body.type_of_beer_id;
  const brewery_id = req.body.brewery_id;

  BeerController.add(name, color, origin, description, type_of_beer_id, brewery_id)
  .then((beer) => {
    return res.status(201).json({"error": false});
  })
  .catch((err) => {
    if(err.errors)
      return res.status(400).json({"error": true, "message": err.errors[0].message});
    return res.status(500).json({"error": true, "message": "Erreur lors de la création de de la bière"});
  });
});

/**
@api {get} beers/?name=name&color=color&origin=origin&type_of_beer_id=type_of_beer_id get all beers
* @apiGroup Beers
* @apiParam {String} name
* @apiParam {String} color
* @apiParam {String} origin
* @apiParam {Int} type_of_beer_id
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Success
*    {
*        "error": false,
*        "message": [
*              {
*                  "id": 1,
*                  "name": "Leffe",
*                  "color": "blonde",
*                  "origin": "Belgique",
*                  "description": "La Leffe ou Abbaye de Leffe est une bière belge d'Abbaye reconnue, créée en 1240 par les chanoines de l'ordre de Prémontré de l'abbaye Notre-Dame de Leffe et produite par la brasserie Artois à Louvain.",
*                  "pathPicture": null,
*                  "created_at": "2019-04-14T09:20:46.000Z",
*                  "updated_at": "2019-04-14T09:20:46.000Z",
*                  "deleted_at": null,
*                  "typeOfBeer": 1
*              }
*        ]
*    }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "Aucune bière trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération des bières"
*    }
*/
beerRouter.get('/', function(req, res) {
  const name = req.query.name;
  const color = req.query.color;
  const origin = req.query.origin;
  const type_of_beer_id = req.query.type_of_beer_id;
  const brewery_id = req.query.brewery_id;

  BeerController.getAll(name, color, origin, type_of_beer_id, brewery_id)
  .then((beers) => {
    if(beers.length == 0)
      return res.status(400).json({"error": true, "message": "Aucune bière trouvé"});
    Object.keys(beers).forEach(function(key){
      delete beers[key]['dataValues']["password"];
    });
    return res.status(200).json({"error": false, "beer": beers});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des bières"});
  });
});

/**
@api {get} beers/:beer_id get beer
* @apiGroup Beers
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Success
*    {
*        "error": false,
*        "beer": {
*            "id": 1,
*            "name": "Leffe",
*            "color": "blanche",
*            "origin": "Belgique",
*            "description": "La Leffe ou Abbaye de Leffe est une bière belge d'Abbaye reconnue, créée en 1240 par les chanoines de l'ordre de Prémontré de l'abbaye Notre-Dame de Leffe et produite par la brasserie Artois à Louvain.",
*            "pathPicture": null,
*            "updated_at": "2019-04-14T09:20:46.668Z",
*            "created_at": "2019-04-14T09:20:46.668Z",
*            "typeOfBeer": [
*                        {
*                            "id": 2,
*                            "name": "Brune",
*                            "created_at": "2019-04-20T09:42:06.000Z",
*                            "updated_at": "2019-04-20T09:42:06.000Z",
*                            "deleted_at": null,
*                            "beer_typeOfBeer": {
*                                "created_at": "2019-04-20T09:44:59.000Z",
*                                "updated_at": "2019-04-20T09:44:59.000Z",
*                                "beer_id": 1,
*                                "type_of_beer_id": 2
*                            }
*                        },
*                        {
*                            "id": 3,
*                            "name": "Blanche",
*                            "created_at": "2019-04-20T09:42:12.000Z",
*                            "updated_at": "2019-04-20T09:42:12.000Z",
*                            "deleted_at": null,
*                            "beer_typeOfBeer": {
*                                "created_at": "2019-04-20T09:45:01.000Z",
*                                "updated_at": "2019-04-20T09:45:01.000Z",
*                                "beer_id": 1,
*                                "type_of_beer_id": 3
*                            }
*                        }
*                    ]
*        }
*    }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "La bière n'existe pas"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération de la bières"
*    }
*/
beerRouter.get('/:beer_id', function(req, res) {
  const beer_id = req.params.beer_id;

  BeerController.getOne(beer_id)
  .then((beer) => {
    if(beer === undefined || beer === null){
      return res.status(400).json({"error": true, "message": "La bière n'existe pas"});
    }
    delete beer['dataValues']["password"];
    return res.status(200).json({"error": false, "beer": beer});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la bière"});
  });
});


/**
@api {get} beers/research/:data research beers
* @apiGroup Beers
* @apiParam {String} data
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Success
* {
*    "error": false,
*        "message": [
*              {
*                  "id": 1,
*                  "name": "Leffe",
*                  "color": "blonde",
*                  "origin": "Belgique",
*                  "description": "La Leffe ou Abbaye de Leffe est une bière belge d'Abbaye reconnue, créée en 1240 par les chanoines de l'ordre de Prémontré de l'abbaye Notre-Dame de Leffe et produite par la brasserie Artois à Louvain.",
*                  "pathPicture": null,
*                  "created_at": "2019-04-14T09:20:46.000Z",
*                  "updated_at": "2019-04-14T09:20:46.000Z",
*                  "deleted_at": null,
*                  "typeOfBeer": [
*                        {
*                            "id": 2,
*                            "name": "Brune",
*                            "created_at": "2019-04-20T09:42:06.000Z",
*                            "updated_at": "2019-04-20T09:42:06.000Z",
*                            "deleted_at": null,
*                            "beer_typeOfBeer": {
*                                "created_at": "2019-04-20T09:44:59.000Z",
*                                "updated_at": "2019-04-20T09:44:59.000Z",
*                                "beer_id": 1,
*                                "type_of_beer_id": 2
*                            }
*                        },
*                        {
*                            "id": 3,
*                            "name": "Blanche",
*                            "created_at": "2019-04-20T09:42:12.000Z",
*                            "updated_at": "2019-04-20T09:42:12.000Z",
*                            "deleted_at": null,
*                            "beer_typeOfBeer": {
*                                "created_at": "2019-04-20T09:45:01.000Z",
*                                "updated_at": "2019-04-20T09:45:01.000Z",
*                                "beer_id": 1,
*                                "type_of_beer_id": 3
*                            }
*                        }
*                    ]
*              }
*        ]
* }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "Aucune bière trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la recherche des bières"
*    }
*/
////////////////////////////////////////////////////
beerRouter.get('/research/:data', function(req, res) {
  const data = req.params.data;

  BeerController.research(data)
  .then((beers) => {
    if(beers === undefined || beers === null)
      return res.status(400).json({"error": true, "message": "Aucune bière trouvé"});
    return res.status(200).json({"error": false, "beer": beers});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la recherche des bières"});
  });
});


/**
@api {put} beers/update/:beer_id update beer
* @apiGroup Beers
* @apiHeader {String} x-access-token
* @apiParam {String} name obligatoire et entre 2 à 200 caractères
* @apiParam {String} color obligatoire et entre 2 à 100 caractères
* @apiParam {String} origin obligatoire, entre 2 et 150 caractères, avec au moins une lettre majuscule, majuscule et un chiffre
* @apiParam {Text} description
* @apiParam {Int} type_of_beer_id
* @apiParamExample {json} Input
*  {
*    "color": "Brune"
*  }
* @apiSuccessExample {json} Success
*    HTTP/1.1 201 Created
*    {
*        "error": false,
*        "beer": {
*            "id": 1,
*            "name": "Leffe",
*            "color": "blanche",
*            "origin": "Belgique",
*            "description": "La Leffe ou Abbaye de Leffe est une bière belge d'Abbaye reconnue, créée en 1240 par les chanoines de l'ordre de Prémontré de l'abbaye Notre-Dame de Leffe et produite par la brasserie Artois à Louvain.",
*            "type_of_beer_id": 1,
*            "pathPicture": null,
*            "updated_at": "2019-04-14T09:21:46.668Z",
*            "created_at": "2019-04-14T09:20:46.668Z"
*            "deleted_at": null
*        }
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
beerRouter.put('/update/:beer_id', isAuthenticatedBeerAccount, function(req, res){
  const beer_id = req.params.beer_id;
  const name = req.body.name;
  const color = req.body.color;
  const origin = req.body.origin;
  const description = req.body.description;
  const type_of_beer_id = req.body.type_of_beer_id;

  asyncLib.waterfall([
    function(done){
      BeerController.getOne(beer_id)
      .then((beer) => {
        if(beer === null || beer === undefined)
          return res.status(400).json({"error": true, "message": "La bière n'existe pas"});
        done(null, beer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la bière"});
      });
    },
    function(beer, done){
      BeerController.update(beer, name, color, origin, description, undefined, type_of_beer_id)
      .then((beer) => {
        return res.status(201).json({"error": false, "beer": beer});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour de la bière"});
      });
    }
  ]);
});

/**
@api {delete} beers/delete/:beer_id delete beer
* @apiGroup Beers
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
*        "message": "La bière n'existe pas"
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
*        "message": "Erreur lors de la récupération de la bière"
*    }
*/
beerRouter.delete('/delete/:beer_id', isAuthenticatedBeerAccount, function(req, res){
  const beer_id = req.params.beer_id;

  asyncLib.waterfall([
    function(done){
      BeerController.getOne(beer_id)
      .then((beer) => {
        if(beer === null || beer === undefined){
          return res.status(400).json({"error": true, "message": "La bière n'existe pas"});
        }
        done(null, beer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la bière"});
      });
    },
    function(beer, done){
      BeerController.delete(beer);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


beerRouter.use(fileUpload());
/**
@api {put} beers/upload/:beer_id upload picture beer
* @apiGroup Beers
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
beerRouter.put('/upload/:beer_id', isAuthenticatedBeerAccount, function(req, res) {
  const beer_id = req.params.beer_id;
  const fileToUpload = req.files.file;
  asyncLib.waterfall([
    function(done){
      BeersController.getOne(beer_id)
      .then((beer) => {
        if(beer === null || beer === undefined)
          return res.status(400).json({"error": true, "message": "La bière n'existe pas"});
        done(null, beer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la bière"});
      });
    },
    function(beer, done){
      const ext = fileToUpload.name.substr(fileToUpload.name.lastIndexOf('.') + 1).toLowerCase();
      const regex = new RegExp(' ','g');
      var src_tracks = beer.id+"."+ext;
      src_tracks = src_tracks.replace(regex, '_');

      if(fileToUpload === undefined)
        return res.status(400).json({"error": true, "message": "Aucune image à upload"}).end();
      if(ext != "png" && ext != "jpg")
        return res.status(400).json({"error": true, "message": "Format de l'image non géré (png et jpg)"}).end();

      fileToUpload.mv("medias/beers/"+src_tracks, function(err) {
        if (err)
          return res.status(400).json({"error": true, "message": "Erreur lors de l'upload"});
        else
          done(null, beer, src_tracks);
      });
    },
    function(beer, src_tracks, done){
      BeerController.update(beer, undefined, undefined, undefined, undefined, src_tracks)
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
  @api {get} beers/download/:beer_id download picture beer
* @apiGroup Beers
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
beerRouter.get('/download/:beer_id', isAuthenticatedBeerAccount, function(req, res){
  const beer_id = req.params.beer_id;
  var pathBeersDefault = path.resolve( __dirname+"/../../medias/beers/");

  BeerController.getOne(beer_id)
  .then((beer) => {
    if(beer === null || beer === undefined)
      return res.status(401).json({"error": true, "message": "La bière n'existe pas"});
    pathBeers = pathBeersDefault + "\\" + beer.pathPicture;

    if (fs.existsSync(pathBeers)){
      const buffer = new Buffer(fs.readFileSync(pathBeers), 'base64');
      res.writeHead(200, {
       'Content-Type': 'image/jpeg',
       'Content-Length': buffer.length
     });
     res.end(buffer);
    }else{
      const buffer = new Buffer(fs.readFileSync(pathBeersDefault + "\\" + 'defaultprofile.png'), 'base64');
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

module.exports = beerRouter;
