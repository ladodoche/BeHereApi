const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const BarController = controllers.BarController;

const barRouter = express.Router();
barRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedBarCreateAccount(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    next();
  });
}

function isAuthenticatedBarAccount(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  BarController.getOne(req.params.bar_id)
  .then((bar) => {
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != bar.user_id) && decoded.admin != 1)
        return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
      next();
    });
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du bar"});
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
@api {post} bars/create add a new bar
* @apiGroup Bars
* @apiHeader {String} x-access-token
* @apiParam {String} name obligatoire, unique et entre 2 à 200 caractères
* @apiParam {Double} gpsLatitude obligatoire
* @apiParam {Double} gpsLongitude obligatoire
* @apiParam {Text} description
* @apiParam {String} webSiteLink format url
* @apiParamExample {json} Input
*  {
*    "name": "Le dernier bar avant la fin du monde",
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
*        "message": "Erreur lors de la création de votre bar"
*    }
*/
barRouter.post('/create', isAuthenticatedBarCreateAccount, function(req, res) {

  const name = req.body.name;
  const gpsLatitude = req.body.gpsLatitude;
  const gpsLongitude = req.body.gpsLongitude;
  const description = req.body.description;
  const webSiteLink = req.body.webSiteLink;

  BarController.add(name, gpsLatitude, gpsLongitude, description, webSiteLink, getUserIdHeader(req))
  .then((bar) => {
    return res.status(201).json({"error": false});
  })
  .catch((err) => {
    if(err.errors)
      return res.status(400).json({"error": true, "message": err.errors[0].message});
    return res.status(500).json({"error": true, "message": "Erreur lors de la création de votre bar"});
  });
});

/**
@api {get} bars/?name=name&user_id=user_id get all bars
* @apiGroup Bars

* @apiParam {String} name
* @apiParam {String} user_id
* @apiSuccessExample {json} Success
*    HTTP/1.1 201 Created
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "name": "Le dernier bar avant la fin du monde",
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
*        "message": "Aucun bar trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération des bars"
*    }
*/
barRouter.get('/', function(req, res) {

  const name = req.body.name;
  const user_id = req.body.user_id;

  BarController.getAll(name, user_id)
  .then((bars) => {
    if(bars.length == 0)
      return res.status(400).json({"error": true, "message": "Aucun bar trouvé"});
    return res.status(200).json({"error": false, "bar": bars});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des bars"});
  });
});

/**
@api {get} bars/:bar_id get bar
* @apiGroup Bars
* @apiSuccessExample {json} Success
* {
*    "error": false,
*    "message": {
*        "id": 1,
*        "name": "Le dernier bar avant la fin du monde",
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
*        "message": "Le bar n'existe pas"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération du bar"
*    }
*/
barRouter.get('/:bar_id', function(req, res) {
  const bar_id = req.params.bar_id;

  BarController.getOne(bar_id)
  .then((bar) => {
    if(bar === undefined || bar === null)
      return res.status(400).json({"error": true, "message": "Le bar n'existe pas"});
    return res.status(200).json({"error": false, "bar": bar});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du bar"});
  });
});

/**
@api {put} bars/update/:bar_id update bar
* @apiGroup Bars
* @apiHeader {String} x-access-token
* @apiParam {String} name unique et entre 2 à 200 caractères
* @apiParam {Double} gpsLatitude
* @apiParam {Double} gpsLongitude
* @apiParam {Text} description
* @apiParam {String} webSiteLink format url
* @apiParamExample {json} Input
*  {
*    "name": "Le dernier bar avant la fin du monde",
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
*        "message": message
*    }
*/
barRouter.put('/update/:bar_id', isAuthenticatedBarAccount, function(req, res){
  const bar_id = req.params.bar_id;
  const name = req.body.name;
  const gpsLatitude = req.body.gpsLatitude;
  const gpsLongitude = req.body.gpsLongitude;
  const description = req.body.description;
  const webSiteLink = req.body.webSiteLink;

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
      BarController.update(bar, name, gpsLatitude, gpsLongitude, description, webSiteLink)
      .then((bar) => {
        return res.status(201).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour du bar"});
      });
    }
  ]);
});

/**
@api {delete} bars/delete/:bar_id delete bar
* @apiGroup Bars
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
*        "message": "Le bar n'existe pas"
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
*        "message": "Erreur lors de la récupération du bar"
*    }
*/
barRouter.delete('/delete/:bar_id', isAuthenticatedBarAccount, function(req, res){
  const bar_id = req.params.bar_id;

  asyncLib.waterfall([
    function(done){
      BarController.getOne(bar_id)
      .then((bar) => {
        if(bar === null || bar === undefined){
          return res.status(400).json({"error": true, "message": "Le bar n'existe pas"});
        }
        done(null, bar);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du bar"});
      });
    },
    function(bar, done){
      BarController.delete(bar);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


module.exports = barRouter;
