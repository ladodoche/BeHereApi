const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const ReservationController = controllers.ReservationController;
const BarController = controllers.BarController;
const UserController = controllers.UserController;

const reservationRouter = express.Router();
reservationRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedUserCreateReservation(req, res, next) {
  const token = req.headers['x-access-token'];
  const user_id = req.body.user_id;

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  UserController.getOne(user_id)
  .then((user) => {
    if(user === null || user === undefined)
      return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"});
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != bar.user_id) && decoded.admin != 1)
        return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
      next();
    });
  }).catch((err) => {
      return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"});
  });
}

function isAuthenticatedUserReservation(req, res, next) {
  const token = req.headers['x-access-token'];
  const reservation_id = req.params.reservation_id;

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  asyncLib.waterfall([
    function(done){
      ReservationController.getOne(reservation_id)
      .then((reservation) => {
        if(reservation === null || reservation === undefined)
          return res.status(400).json({"error": true, "message": "La réservation n'existe pas"});
        else
          done(null, reservation);
      }).catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la réservation"});
      });
    },
    function(reservation, done){
      UserController.getOne(reservation.user_id)
      .then((user) => {
        if(user === null || user === undefined)
          return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"});
        jwt.verify(token, auth.secret, function(err, decoded) {
          if (err)
            return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
          if ((decoded.id != user.id) && decoded.admin != 1)
            return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
          next();
        });
      }).catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"});
      });
    }
  ]);
}

function isAuthenticatedUserBarReservation(req, res, next) {
  const token = req.headers['x-access-token'];
  const reservation_id = req.params.reservation_id;

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  asyncLib.waterfall([
    function(done){
      ReservationController.getOne(reservation_id)
      .then((reservation) => {
        if(reservation === null || reservation === undefined)
          return res.status(400).json({"error": true, "message": "La réservation n'existe pas"});
        else
          done(null, reservation);
      }).catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la réservation"});
      });
    },
    function(reservation, done){
      BarController.getOne(reservation.bar_id)
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

/**
@api {post} reservations/create add a new reservation
* @apiGroup Reservations
* @apiHeader {String} x-access-token
* @apiParam {int} numberOfPeople obligatoire
* @apiParam {Date} arrivalTime obligatoire
* @apiParam {Int} bar_id obligatoire
* @apiParam {Int} user_id obligatoire
* @apiParamExample {json} Input
*  {
*    "numberOfPeople": 8,
*    "arrivalTime": "26/04/2019 18:00",
*    "user_id": "1",
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
*        "message": message
*    }
*/
reservationRouter.post('/create', isAuthenticatedUserCreateReservation, function(req, res) {

  const numberOfPeople = req.body.numberOfPeople;
  const arrivalTime = req.body.arrivalTime;
  const user_id = req.body.user_id;
  const bar_id = req.body.bar_id;

  asyncLib.waterfall([
    function(done){
      UserController.getOne(user_id)
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
      BarController.getOne(bar_id)
      .then((bar) => {
        if(bar === null || bar === undefined)
          return res.status(400).json({"error": true, "message": "Le bar n'existe pas"});
        done(null, user, bar);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du bar"});
      });
    },
    function(user, bar, done){
      ReservationController.add(numberOfPeople, arrivalTime, user_id, bar_id)
      .then((reservation) => {
        return res.status(201).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la création de votre réservation"});
      });
    }
  ]);
});

/**
@api {get} reservations/?bar_id=bar_id&user_id=user_id get all reservations
* @apiGroup Reservations
* @apiParam {String} bar_id
* @apiParam {String} user_id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "numberOfPeople": 8,
*            "arrivalTime": "26/04/2019 18:00",
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
*        "message": message
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": message
*    }
*/
reservationRouter.get('/', function(req, res) {

  const bar_id = req.query.bar_id;
  const user_id = req.query.user_id;

  ReservationController.getAll(user_id, bar_id)
  .then((reservations) => {
    if(reservations.length == 0)
      return res.status(400).json({"error": true, "message": "Aucune réservation trouvé"});
    return res.status(200).json({"error": false, "reservation": reservations});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des réservations"});
  });
});

/**
@api {get} reservations/:reservation_id get reservation
* @apiGroup Reservations
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*            "id": 1,
*            "numberOfPeople": 8,
*            "arrivalTime": "26/04/2019 18:00",
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
*        "message": message
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": message
*    }
*/
reservationRouter.get('/:reservation_id', function(req, res) {
  const reservation_id = req.params.reservation_id;

  ReservationController.getOne(reservation_id)
  .then((reservation) => {
    if(reservation === undefined || reservation === null)
      return res.status(400).json({"error": true, "message": "La réservation n'existe pas"});
    return res.status(200).json({"error": false, "reservation": reservation});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la réservation"});
  });
});

/**
@api {put} reservations/update/:reservation_id update reservation
* @apiGroup Reservations
* @apiHeader {String} x-access-token
* @apiParam {int} numberOfPeople obligatoire
* @apiParam {Date} arrivalTime obligatoire
* @apiParamExample {json} Input
*  {
*      "numberOfPeople": 8,
*      "arrivalTime": "26/04/2019 18:00",
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
reservationRouter.put('/update/:reservation_id', isAuthenticatedUserReservation, function(req, res){
  const reservation_id = req.params.reservation_id;
  const numberOfPeople = req.body.numberOfPeople;
  const arrivalTime = req.body.arrivalTime;

  asyncLib.waterfall([
    function(done){
      ReservationController.getOne(reservation_id)
      .then((reservation) => {
        if(reservation === null || reservation === undefined)
          return res.status(400).json({"error": true, "message": "La réservatiion n'existe pas"});
        done(null, reservation);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la réservation"});
      });
    },
    function(reservation, done){
      ReservationController.update(reservation, numberOfPeople, arrivalTime)
      .then((reservation) => {
        return res.status(200).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour de la réservation"});
      });
    }
  ]);
});

/**
@api {delete} reservations/delete/:reservation_id delete reservation
* @apiGroup Reservations
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
reservationRouter.delete('/delete/:reservation_id', isAuthenticatedUserReservation, function(req, res){
  const reservation_id = req.params.reservation_id;

  asyncLib.waterfall([
    function(done){
      ReservationController.getOne(reservation_id)
      .then((reservation) => {
        if(reservation === null || reservation === undefined){
          return res.status(400).json({"error": true, "message": "La réservation n'existe pas"});
        }
        done(null, reservation);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la réservation"});
      });
    },
    function(reservation, done){
      ReservationController.delete(reservation);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


/**
@api {put} reservations/valid/:reservation_id update reservation
* @apiGroup Reservations
* @apiHeader {String} x-access-token
* @apiParam {bool} valid
* @apiParamExample {json} Input
*  {
*      "valid": true
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
reservationRouter.put('/valid/:reservation_id', isAuthenticatedUserBarReservation, function(req, res){
  const reservation_id = req.params.reservation_id;
  const valid = req.body.valid;

  asyncLib.waterfall([
    function(done){
      ReservationController.getOne(reservation_id)
      .then((reservation) => {
        if(reservation === null || reservation === undefined)
          return res.status(400).json({"error": true, "message": "La réservatiion n'existe pas"});
        done(null, reservation);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la réservation"});
      });
    },
    function(reservation, done){
      ReservationController.update(reservation, undefined, undefined, valid)
      .then((reservation) => {
        return res.status(200).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour de la réservation"});
      });
    }
  ]);
});

module.exports = reservationRouter;
