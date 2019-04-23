const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const jwt = require('jsonwebtoken');
const asyncLib = require('async');
const auth = require('../auth.js');
const BeerController = controllers.BeerController;
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
* @apiParamExample {json} Input
*  {
*    "name": "Leffe",
*    "color": "blonde",
*    "origin": "Belgique",
*    "description": "La Leffe ou Abbaye de Leffe est une bière belge d'Abbaye reconnue, créée en 1240 par les chanoines de l'ordre de Prémontré de l'abbaye Notre-Dame de Leffe et produite par la brasserie Artois à Louvain."
*  }
* @apiSuccessExample {json} Success
*    HTTP/1.1 201 Created
*    {
*        "error": false,
*        "beer": {
*            "name": "Leffe",
*            "color": "blonde",
*            "origin": "Belgique",
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

  BeerController.add(name, color, origin, description)
  .then((beer) => {
    console.log("1");
    return res.status(201).json({"error": false});
  })
  .catch((err) => {
    console.log(err);
    if(err.errors)
      return res.status(400).json({"error": true, "message": err.errors[0].message});
    return res.status(500).json({"error": true, "message": "Erreur lors de la création de de la bière"});
  });
});

/**
@api {get} beers/?email=email&color=color&origin=origin get all beers
* @apiGroup Beers
* @apiParam {String} name
* @apiParam {String} color
* @apiParam {String} origin
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
  const email = req.query.email;

  BeerController.getAll(email)
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
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la bières"});
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
* @apiParamExample {json} Input
*  {
*    "color": "Brune",
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

  asyncLib.waterfall([
    function(done){
      BeerController.getOne(beer_id)
      .then((beer) => {
        console.log("1");
        if(beer === null || beer === undefined)
          return res.status(400).json({"error": true, "message": "La bière n'existe pas"});
        done(null, beer);
      })
      .catch((err) => {
        console.log("2");
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la bière"});
      });
    },
    function(beer, done){
      console.log("3");
      BeerController.update(beer, name, color, origin, description)
      .then((beer) => {
        console.log("4");
        return res.status(201).json({"error": false, "beer": beer});
      })
      .catch((err) => {
        console.log("5");
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour de la bière"});

          console.log("6");
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

//////////////////////////////////////////////////////
/**
@api {put} beers/:beer_id/addTypeOfBeer add link between type of beer and beer
* @apiGroup Beers
* @apiHeader {String} x-access-token
* @apiParam {String} typeOfBeer_id
* @apiParamExample {json} Input
*  {
*    "typeOfBeer_id": 1
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
beerRouter.put('/:beer_id/addTypeOfBeer', isAuthenticatedBeerAccount, function(req, res) {
  const beer_id = req.params.beer_id;
  const typeOfBeer_id = req.body.typeOfBeer_id;

  if(typeOfBeer_id === undefined || beer_id === undefined)
    return res.status(400).json({"error": true, "message": "Certains paramètres sont manquant"}).end();

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
      console.log(beer_id);
      BeerController.getOne(beer_id)
      .then((beer) => {
        console.log(beer);
        if(beer === null || beer === undefined)
          return res.status(400).json({"error": true, "message": "La bière n'existe pas"}).end();
        done(null, typeOfBeer, beer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la bière"}).end();
      });
    },
    function(typeOfBeer, beer, done){
      BeerController.addTypeOfBeer(beer, typeOfBeer)
      .then((TypeOfBeer_Beer) => {
        return res.status(200).json({"error": false}).end();
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de l'ajout du lien entre la bière et le type de bière"}).end();
      });
    }
  ]);
});

/**
@api {put} beers/:beer_id/deleteTypeOfBeer/:typeOfBeer_id delete link between type of beer and beer
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
  beerRouter.delete('/:beer_id/deleteTypeOfBeer/:typeOfBeer_id', isAuthenticatedBeerAccount, function(req, res) {
  const typeOfBeer_id = req.params.typeOfBeer_id;
  const beer_id = req.params.beer_id;

  if(typeOfBeer_id === undefined || beer_id === undefined)
    return res.status(400).json({"error": true, "message": "Certains paramètres sont manquant"}).end();

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
      BeerController.getOne(beer_id)
      .then((beer) => {
        if(beer === null || beer === undefined)
          return res.status(400).json({"error": true, "message": "La bière n'existe pas"}).end();
        done(null, typeOfBeer, beer);
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la bière"}).end();
      });
    },
    function(typeOfBeer, beer, done){
      BeerController.deleteBeer(beer, typeOfBeer);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});

module.exports = beerRouter;
