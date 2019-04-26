const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const MenusBeerController = controllers.MenusBeerController;
const BarController = controllers.BarController;
const BeerController = controllers.BeerController;

const menusBeerRouter = express.Router();
menusBeerRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedUserCreateMenu(req, res, next) {
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

function isAuthenticatedUserMenu(req, res, next) {
  const token = req.headers['x-access-token'];
  const menusBeer_id = req.params.menusBeer_id;

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  asyncLib.waterfall([
    function(done){
      MenusBeerController.getOne(menusBeer_id)
      .then((menuBeer) => {
        if(menuBeer === null || menuBeer === undefined)
          return res.status(400).json({"error": true, "message": "Le menu n'existe pas"});
        else
          done(null, menuBeer);
      }).catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du menu"});
      });
    },
    function(menuBeer, done){
      BarController.getOne(menuBeer.bar_id)
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
@api {post} menusBeers/create add a new menusBeer
* @apiGroup MenusBeers
* @apiHeader {String} x-access-token
* @apiParam {String} price obligatoire
* @apiParam {Int} bar_id obligatoire
* @apiParam {Int} beer_id obligatoire
* @apiParamExample {json} Input
*  {
*    "price": "8.60",
*    "beer_id": "1",
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
menusBeerRouter.post('/create', isAuthenticatedUserCreateMenu, function(req, res) {

  const price = req.body.price;
  const beer_id = req.body.beer_id;
  const bar_id = req.body.bar_id;

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
      BarController.getOne(bar_id)
      .then((bar) => {
        if(bar === null || bar === undefined)
          return res.status(400).json({"error": true, "message": "Le bar n'existe pas"});
        done(null, beer, bar);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du bar"});
      });
    },
    function(beer, bar, done){
      MenusBeerController.add(price, beer_id, bar_id)
      .then((menusBeer) => {
        return res.status(201).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la création de votre menu"});
      });
    }
  ]);
});

/**
@api {get} menusBeers/?bar_id=bar_id&beer_id=beer_id get all menusBeers
* @apiGroup MenusBeers
* @apiParam {String} bar_id
* @apiParam {String} beer_id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "price": "10.00",
*            "bar_id": 1,
*            "beer_id": 1,
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
menusBeerRouter.get('/', function(req, res) {

  const bar_id = req.query.bar_id;
  const beer_id = req.query.beer_id;

  MenusBeerController.getAll(beer_id, bar_id)
  .then((menusBeers) => {
    if(menusBeers.length == 0)
      return res.status(400).json({"error": true, "message": "Aucun menu trouvé"});
    return res.status(200).json({"error": false, "menusBeer": menusBeers});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des menus"});
  });
});

/**
@api {get} menusBeers/:menusBeer_id get menusBeer
* @apiGroup MenusBeers
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*            "id": 1,
*            "price": "10.00",
*            "bar_id": 1,
*            "beer_id": 1,
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
menusBeerRouter.get('/:menusBeer_id', function(req, res) {
  const menusBeer_id = req.params.menusBeer_id;

  MenusBeerController.getOne(menusBeer_id)
  .then((menusBeer) => {
    if(menusBeer === undefined || menusBeer === null)
      return res.status(400).json({"error": true, "message": "Le menu n'existe pas"});
    return res.status(200).json({"error": false, "menusBeer": menusBeer});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du menu"});
  });
});

/**
@api {put} menusBeers/update/:menusBeer_id update menusBeer
* @apiGroup menusBeers
* @apiHeader {String} x-access-token
* @apiParam {String} price obligatoire
* @apiParamExample {json} Input
*  {
*     "price": "10.00",
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
menusBeerRouter.put('/update/:menusBeer_id', isAuthenticatedUserMenu, function(req, res){
  const menusBeer_id = req.params.menusBeer_id;
  const price = req.body.price;
  const hidden = req.body.hidden;

  asyncLib.waterfall([
    function(done){
      MenusBeerController.getOne(menusBeer_id)
      .then((menusBeer) => {
        if(menusBeer === null || menusBeer === undefined)
          return res.status(400).json({"error": true, "message": "Le menu n'existe pas"});
        done(null, menusBeer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du menu"});
      });
    },
    function(menusBeer, done){
      MenusBeerController.update(menusBeer, price, hidden)
      .then((menusBeer) => {
        return res.status(200).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour du menu"});
      });
    }
  ]);
});

/**
@api {delete} menusBeers/delete/:menusBeer_id delete menusBeer
* @apiGroup MenusBeers
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
menusBeerRouter.delete('/delete/:menusBeer_id', isAuthenticatedUserMenu, function(req, res){
  const menusBeer_id = req.params.menusBeer_id;

  asyncLib.waterfall([
    function(done){
      MenusBeerController.getOne(menusBeer_id)
      .then((menusBeer) => {
        if(menusBeer === null || menusBeer === undefined){
          return res.status(400).json({"error": true, "message": "Le menu n'existe pas"});
        }
        done(null, menusBeer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du menu"});
      });
    },
    function(menusBeer, done){
      MenusBeerController.delete(menusBeer);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


module.exports = menusBeerRouter;
