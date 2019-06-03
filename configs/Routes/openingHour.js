const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const OpeningHourController = controllers.OpeningHourController;
const BarController = controllers.BarController;

const openingHourRouter = express.Router();
openingHourRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedOpeningHour(req, res, next) {
  const token = req.headers['x-access-token'];
  var bar_id;
  if(req.params.bar_id != null && req.params.bar_id != undefined)
    bar_id = req.params.bar_id;
  if(req.body.bar_id != null && req.body.bar_id != undefined)
    bar_id = req.body.bar_id;

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  BarController.getOne(bar_id)
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

/**
@api {post} openingHours/create add a new opening hour
* @apiGroup OpeningHours
* @apiHeader {String} x-access-token
* @apiParam {String} day obligatoire
* @apiParam {String} opening obligatoire
* @apiParam {String} closing obligatoire
* @apiParam {String} earlyHappyHour
* @apiParam {String} lateHappyHour
* @apiParam {String} bar_id
* @apiParamExample {json} Input
*  {
*    "day": "lundi",
*    "opening": "14:00",
*    "closing": "23:00",
*    "earlyHappyHour": "17:00",
*    "lateHappyHour": "20:00",
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
*        "message": "Erreur lors de la création de vos horaires"
*    }
*/
openingHourRouter.post('/create', isAuthenticatedOpeningHour, function(req, res) {

  const day = req.body.day;
  const opening = req.body.opening;
  const closing = req.body.closing;
  const earlyHappyHour = req.body.earlyHappyHour;
  const lateHappyHour = req.body.lateHappyHour;
  const bar_id = req.body.bar_id;
  OpeningHourController.add(day, opening, closing, earlyHappyHour, lateHappyHour, bar_id)
  .then((openingHour) => {
    return res.status(201).json({"error": false});
  })
  .catch((err) => {
    if(err.errors)
      return res.status(400).json({"error": true, "message": err.errors[0].message});
    return res.status(500).json({"error": true, "message": "Erreur lors de la création de vos horaires"});
  });
});

/**
@api {get} openingHours/?day=day&bar_id=bar_id get all openingHours
* @apiGroup OpeningHours
* @apiParam {String} day
* @apiParam {String} bar_id
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "day": "samedi",
*            "opening": "10:00",
*            "closing": "23:00",
*            "earlyHappyHour": "17:00",
*            "lateHappyHour": "20:00",
*            "created_at": "2019-06-03T16:37:58.000Z",
*            "updated_at": "2019-06-03T16:37:58.000Z",
*            "deleted_at": null,
*            "bar_id": 1
*        }
*    ]
* }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "Aucun horaire trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération des horaires"
*    }
*/
openingHourRouter.get('/', function(req, res) {
  const day = req.query.day;
  const bar_id = req.query.bar_id;

  OpeningHourController.getAll(day, bar_id)
  .then((openingHours) => {
    if(openingHours.length == 0)
      return res.status(400).json({"error": true, "message": "Aucun horaire trouvé"});
    return res.status(200).json({"error": false, "openingHour": openingHours});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des horaires"});
  });
});

/**
@api {get} openingHours/:openingHour_id get opening hour
* @apiGroup OpeningHours
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*            "id": 1,
*            "day": "samedi",
*            "opening": "10:00",
*            "closing": "23:00",
*            "earlyHappyHour": "17:00",
*            "lateHappyHour": "20:00",
*            "created_at": "2019-06-03T16:37:58.000Z",
*            "updated_at": "2019-06-03T16:37:58.000Z",
*            "deleted_at": null,
*            "bar_id": 1
*    }
* }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "L'horaire n'existe pas"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération de l'horaire"
*    }
*/
openingHourRouter.get('/:openingHour_id', function(req, res) {
  const openingHour_id = req.params.openingHour_id;

  OpeningHourController.getOne(openingHour_id)
  .then((openingHour) => {
    if(openingHour === undefined || openingHour === null)
      return res.status(400).json({"error": true, "message": "L'horaire n'existe pas"});
    return res.status(200).json({"error": false, "openingHour": openingHour});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'horaire"});
  });
});


/**
@api {put} openingHours/update/:openingHour_id update openingHour
* @apiGroup OpeningHours
* @apiHeader {String} x-access-token
* @apiParam {String} name unique et entre 2 à 200 caractères
* @apiParam {Double} gpsLatitude
* @apiParam {Double} gpsLongitude
* @apiParam {Text} description
* @apiParam {String} webSiteLink format url
* @apiParam {String} facebokLink format url
* @apiParam {String} twitterLink format url
* @apiParam {String} instagramLink format url
* @apiParamExample {json} Input
*  {
*    "day": "lundi",
*    "opening": "14:00",
*    "closing": "23:00",
*    "earlyHappyHour": "17:00",
*    "lateHappyHour": "20:00"
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
openingHourRouter.put('/update/:openingHour_id', isAuthenticatedOpeningHour, function(req, res){
  const openingHour_id = req.params.openingHour_id;
  const day = req.body.day;
  const opening = req.body.opening;
  const closing = req.body.closing;
  const earlyHappyHour = req.body.earlyHappyHour;
  const lateHappyHour = req.body.lateHappyHour;

  asyncLib.waterfall([
    function(done){
      OpeningHourController.getOne(openingHour_id)
      .then((openingHour) => {
        if(openingHour === null || openingHour === undefined)
          return res.status(400).json({"error": true, "message": "L'horaire n'existe pas"});
        done(null, openingHour);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'horaire"});
      });
    },
    function(openingHour, done){
      OpeningHourController.update(openingHour, day, opening, closing, earlyHappyHour, lateHappyHour)
      .then((openingHour) => {
        return res.status(200).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour de l'horaire"});
      });
    }
  ]);
});

/**
@api {delete} openingHours/delete/:openingHour_id delete openingHour
* @apiGroup openingHours
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
*        "message": "L'horaire n'existe pas"
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
*        "message": "Erreur lors de la récupération de l'horaire"
*    }
*/
openingHourRouter.delete('/delete/:openingHour_id', isAuthenticatedOpeningHour, function(req, res){
  const openingHour_id = req.params.openingHour_id;

  asyncLib.waterfall([
    function(done){
      OpeningHourController.getOne(openingHour_id)
      .then((openingHour) => {
        if(openingHour === null || openingHour === undefined){
          return res.status(400).json({"error": true, "message": "L'horaire n'existe pas"});
        }
        done(null, openingHour);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'horaire"});
      });
    },
    function(openingHour, done){
      OpeningHourController.delete(openingHour);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});

module.exports = openingHourRouter;
