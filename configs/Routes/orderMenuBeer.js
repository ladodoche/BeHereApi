const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const OrderMenuBeerController = controllers.OrderMenuBeerController;
const MenuBeerController = controllers.MenuBeerController;
const ReservationController = controllers.ReservationController;

const orderMenuBeerRouter = express.Router();
orderMenuBeerRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedReservationCreateOrderMenuBeer(req, res, next) {
  const token = req.headers['x-access-token'];
  const reservation_id = req.body.reservation_id;

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  ReservationController.getOne(reservation_id)
  .then((reservation) => {
    if(reservation === null || reservation === undefined)
      return res.status(400).json({"error": true, "message": "La reservation n'existe pas"});
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != reservation.user_id) && decoded.admin != 1)
        return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
      next();
    });
  }).catch((err) => {
      return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la réservation"});
  });
}

function isAuthenticatedReservationOrderMenuBeer(req, res, next) {
  const token = req.headers['x-access-token'];
  const orderMenuBeer_id = req.params.orderMenuBeer_id;

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  asyncLib.waterfall([
    function(done){
      OrderMenuBeerController.getOne(orderMenuBeer_id)
      .then((orderMenuBeer) => {
        if(orderMenuBeer === null || orderMenuBeer === undefined)
          return res.status(400).json({"error": true, "message": "La commande n'existe pas"});
        else
          done(null, orderMenuBeer);
      }).catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la commande"});
      });
    },
    function(orderMenuBeer, done){
      ReservationController.getOne(orderMenuBeer.reservation_id)
      .then((reservation) => {
        if(reservation === null || reservation === undefined)
          return res.status(400).json({"error": true, "message": "La réservation n'existe pas"});
        jwt.verify(token, auth.secret, function(err, decoded) {
          if (err)
            return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
          if ((decoded.id != reservation.user_id) && decoded.admin != 1)
            return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
          next();
        });
      }).catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la réservation"});
      });
    }
  ]);
}


/**
@api {post} orderMenuBeers/create add a new orderMenuBeer
* @apiGroup OrderMenuBeers
* @apiHeader {String} x-access-token
* @apiParam {int} quantity obligatoire
* @apiParam {Int} reservation_id obligatoire
* @apiParam {Int} menuBeer_id obligatoire
* @apiParamExample {json} Input
*  {
*    "quantity": 8,
*    "reservation_id": "1",
*    "menuBeer_id": "1"
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
orderMenuBeerRouter.post('/create', isAuthenticatedReservationCreateOrderMenuBeer, function(req, res) {

  const quantity = req.body.quantity;
  const reservation_id = req.body.reservation_id;
  const menuBeer_id = req.body.menuBeer_id;

  asyncLib.waterfall([
    function(done){
      ReservationController.getOne(reservation_id)
      .then((reservation) => {
        if(reservation === null || reservation === undefined)
          return res.status(400).json({"error": true, "message": "La réservation n'existe pas"});
        done(null, reservation);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la réservation"});
      });
    },
    function(reservation, done){
      MenuBeerController.getOne(menuBeer_id)
      .then((menuBeer) => {
        if(menuBeer === null || menuBeer === undefined)
          return res.status(400).json({"error": true, "message": "Le menu n'existe pas"});
        done(null, reservation, menuBeer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du menu"});
      });
    },
    function(reservation, menuBeer, done){
      OrderMenuBeerController.add(quantity, reservation_id, menuBeer_id)
      .then((orderMenuBeer) => {
        return res.status(201).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la création de votre commande"});
      });
    }
  ]);
});

/**
@api {get} orderMenuBeers/?menuBeer_id=menuBeer_id&reservation_id=reservation_id get all orderMenuBeers
* @apiGroup OrderMenuBeers
* @apiParam {String} menuBeer_id
* @apiParam {String} reservation_id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "quantity": 8,
*            "menuBeer_id": 1,
*            "reservation_id": 1,
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
orderMenuBeerRouter.get('/', function(req, res) {

  const menuBeer_id = req.query.menuBeer_id;
  const reservation_id = req.query.reservation_id;

  OrderMenuBeerController.getAll(reservation_id, menuBeer_id)
  .then((orderMenuBeers) => {
    if(orderMenuBeers.length == 0)
      return res.status(400).json({"error": true, "message": "Aucune commande trouvé"});
    return res.status(200).json({"error": false, "orderMenuBeer": orderMenuBeers});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la commande"});
  });
});

/**
@api {get} orderMenuBeers/:orderMenuBeer_id get orderMenuBeer
* @apiGroup OrderMenuBeers
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*            "id": 1,
*            "quantity": 8,
*            "menuBeer_id": 1,
*            "reservation_id": 1,
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
orderMenuBeerRouter.get('/:orderMenuBeer_id', function(req, res) {
  const orderMenuBeer_id = req.params.orderMenuBeer_id;

  OrderMenuBeerController.getOne(orderMenuBeer_id)
  .then((orderMenuBeer) => {
    if(orderMenuBeer === undefined || orderMenuBeer === null)
      return res.status(400).json({"error": true, "message": "La commande n'existe pas"});
    return res.status(200).json({"error": false, "orderMenuBeer": orderMenuBeer});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la commande"});
  });
});

/**
@api {put} orderMenuBeers/update/:orderMenuBeer_id update orderMenuBeer
* @apiGroup OrderMenuBeers
* @apiHeader {String} x-access-token
* @apiParam {int} quantity obligatoire
* @apiParamExample {json} Input
*  {
*      "numberOfPeople": 8
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
orderMenuBeerRouter.put('/update/:orderMenuBeer_id', isAuthenticatedReservationOrderMenuBeer, function(req, res){
  const orderMenuBeer_id = req.params.orderMenuBeer_id;
  const quantity = req.body.quantity;

  asyncLib.waterfall([
    function(done){
      OrderMenuBeerController.getOne(orderMenuBeer_id)
      .then((orderMenuBeer) => {
        if(orderMenuBeer === null || orderMenuBeer === undefined)
          return res.status(400).json({"error": true, "message": "La commande n'existe pas"});
        done(null, orderMenuBeer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la commande"});
      });
    },
    function(orderMenuBeer, done){
      OrderMenuBeerController.update(orderMenuBeer, quantity)
      .then((orderMenuBeer) => {
        return res.status(200).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour de la commande"});
      });
    }
  ]);
});

/**
@api {delete} orderMenuBeers/delete/:orderMenuBeer_id delete orderMenuBeer
* @apiGroup OrderMenuBeers
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
orderMenuBeerRouter.delete('/delete/:orderMenuBeer_id', isAuthenticatedReservationOrderMenuBeer, function(req, res){
  const orderMenuBeer_id = req.params.orderMenuBeer_id;

  asyncLib.waterfall([
    function(done){
      OrderMenuBeerController.getOne(orderMenuBeer_id)
      .then((orderMenuBeer) => {
        if(orderMenuBeer === null || orderMenuBeer === undefined){
          return res.status(400).json({"error": true, "message": "La commande n'existe pas"});
        }
        done(null, orderMenuBeer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la commande"});
      });
    },
    function(orderMenuBeer, done){
      OrderMenuBeerController.delete(orderMenuBeer);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});

module.exports = orderMenuBeerRouter;
