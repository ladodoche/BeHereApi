const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const BreweryController = controllers.BreweryController;

const breweryRouter = express.Router();
breweryRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedBreweryCreateAccount(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    next();
  });
}

function isAuthenticatedBreweryAccount(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  BreweryController.getOne(req.params.brewery_id)
  .then((brewery) => {
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != brewery.user_id) && decoded.admin != 1)
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
@api {post} brewerys/create add a new brewery
* @apiGroup Brewerys
* @apiHeader {String} x-access-token
* @apiParam {String} name obligatoire, unique et entre 2 à 200 caractères
* @apiParam {Double} gpsLatitude obligatoire
* @apiParam {Double} gpsLongitude obligatoire
* @apiParam {Text} description
* @apiParam {String} webSiteLink format url
* @apiParamExample {json} Input
*  {
*    "name": "La dernière brasserie avant la fin du monde",
*    "gpsLatitude": "48.",
*    "gpsLongitude": "2.3461672",
*    "description": "Coucou",
*    "webSiteLink": "https://www.facebook.com/?ref=tn_tnmn"
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
*        "message": "Erreur lors de la création de votre brasserie"
*    }
*/
breweryRouter.post('/create', isAuthenticatedBreweryCreateAccount, function(req, res) {

  const name = req.body.name;
  const gpsLatitude = req.body.gpsLatitude;
  const gpsLongitude = req.body.gpsLongitude;
  const description = req.body.description;
  const webSiteLink = req.body.webSiteLink;

  BreweryController.add(name, gpsLatitude, gpsLongitude, description, webSiteLink, getUserIdHeader(req))
  .then((brewery) => {
    return res.status(201).json({"error": false});
  })
  .catch((err) => {
    if(err.errors)
      return res.status(400).json({"error": true, "message": err.errors[0].message});
    return res.status(500).json({"error": true, "message": "Erreur lors de la création de votre brasserie"});
  });
});

/**
@api {get} brewerys/?name=name&user_id=user_id get all brewerys
* @apiGroup Brewerys

* @apiParam {String} name
* @apiParam {String} user_id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "name": "La dernière brasserie avant la fin du monde",
*            "gpsLatitude": 48,
*            "gpsLongitude": 2.3461672,
*            "description": "Coucou",
*            "webSiteLink": "https://www.facebook.com/?ref=tn_tnmn",
*            "created_at": "2019-04-14T13:42:47.000Z",
*            "updated_at": "2019-04-14T13:42:47.000Z",
*            "deleted_at": null,
*            "user_id": 1
*        }
*    ]
* }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "Aucune brasserie trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération des brasseries"
*    }
*/
breweryRouter.get('/', function(req, res) {

  const name = req.body.name;
  const user_id = req.body.user_id;

  BreweryController.getAll(name, user_id)
  .then((brewerys) => {
    if(brewerys.length == 0)
      return res.status(400).json({"error": true, "message": "Aucune brasserie trouvé"});
    return res.status(200).json({"error": false, "brewery": brewerys});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des brasseries"});
  });
});

/**
@api {get} brewerys/:brewery_id get brewery
* @apiGroup Brewerys
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*        "id": 1,
*        "name": "La dernière brasserie avant la fin du monde",
*        "gpsLatitude": 48,
*        "gpsLongitude": 2.3461672,
*        "description": "Coucou",
*        "webSiteLink": "https://www.facebook.com/?ref=tn_tnmn",
*        "created_at": "2019-04-14T13:42:47.000Z",
*        "updated_at": "2019-04-14T13:42:47.000Z",
*        "deleted_at": null,
*        "user_id": 1
*    }
* }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "La brasserie n'existe pas"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération de la brasserie"
*    }
*/
breweryRouter.get('/:brewery_id', function(req, res) {
  const brewery_id = req.params.brewery_id;

  BreweryController.getOne(brewery_id)
  .then((brewery) => {
    if(brewery === undefined || brewery === null)
      return res.status(400).json({"error": true, "message": "La brasserie n'existe pas"});
    return res.status(200).json({"error": false, "brewery": brewery});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du brewery"});
  });
});

/**
@api {put} brewerys/update/:brewery_id update brewery
* @apiGroup Brewerys
* @apiHeader {String} x-access-token
* @apiParam {String} name unique et entre 2 à 200 caractères
* @apiParam {Double} gpsLatitude
* @apiParam {Double} gpsLongitude
* @apiParam {Text} description
* @apiParam {String} webSiteLink format url
* @apiParamExample {json} Input
*  {
*    "name": "La dernière brasserie avant la fin du monde",
*    "gpsLatitude": "48.",
*    "gpsLongitude": "2.3461672",
*    "description": "Coucou",
*    "webSiteLink": "https://www.facebook.com/?ref=tn_tnmn"
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
breweryRouter.put('/update/:brewery_id', isAuthenticatedBreweryAccount, function(req, res){
  const brewery_id = req.params.brewery_id;
  const name = req.body.name;
  const gpsLatitude = req.body.gpsLatitude;
  const gpsLongitude = req.body.gpsLongitude;
  const description = req.body.description;
  const webSiteLink = req.body.webSiteLink;

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
      BreweryController.update(brewery, name, gpsLatitude, gpsLongitude, description, webSiteLink)
      .then((brewery) => {
        return res.status(200).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour de la brasserie"});
      });
    }
  ]);
});

/**
@api {delete} brewerys/delete/:brewery_id delete brewery
* @apiGroup Brewerys
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
*        "message": "La brasserie n'existe pas"
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
*        "message": "Erreur lors de la récupération de la brasserie"
*    }
*/
breweryRouter.delete('/delete/:brewery_id', isAuthenticatedBreweryAccount, function(req, res){
  const brewery_id = req.params.brewery_id;

  asyncLib.waterfall([
    function(done){
      BreweryController.getOne(brewery_id)
      .then((brewery) => {
        if(brewery === null || brewery === undefined){
          return res.status(400).json({"error": true, "message": "La brasserie n'existe pas"});
        }
        done(null, brewery);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la brasserie"});
      });
    },
    function(brewery, done){
      BreweryController.delete(brewery);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


module.exports = breweryRouter;
