const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const CommentsBarController = controllers.CommentsBarController;
const CommentsBeerController = controllers.CommentsBeerController;
const CommentsBreweryController = controllers.CommentsBreweryController;
const CommentsUserController = controllers.CommentsUserController;
const UserController = controllers.UserController;
const BarController = controllers.BarController;
const BreweryController = controllers.BreweryController;
const GroupController = controllers.GroupController;
const BeerController = controllers.BeerController;
const MenusBeerController = controllers.MenusBeerController;

const generalRouter = express.Router();
generalRouter.use(bodyParser.json({limit: '10mb'}));

/**
* @api {get} commentsUser/:user_id get all user comments
* @apiGroup Generals
* @apiParam {String} user_id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "commentsBars": [
*        {
*            "id": 1,
*            "text": "J'adore ce bar",
*            "bar_id": 1,
*            "user_id": 1,
*            "created_at": "2019-04-14T13:42:47.000Z",
*            "updated_at": "2019-04-14T13:42:47.000Z",
*            "deleted_at": null
*        }
*    ],
*    "commentsBeers": [
*        {
*            "id": 1,
*            "text": "J'adore cette bière",
*            "beer_id": 1,
*            "user_id": 1,
*            "created_at": "2019-04-14T13:42:47.000Z",
*            "updated_at": "2019-04-14T13:42:47.000Z",
*            "deleted_at": null
*        }
*    ],
*    "commentsBrewery": [
*        {
*            "id": 1,
*            "text": "J'adore cette brasserie",
*            "brewery_id": 1,
*            "user_id": 1,
*            "created_at": "2019-04-14T13:42:47.000Z",
*            "updated_at": "2019-04-14T13:42:47.000Z",
*            "deleted_at": null
*        }
*    ]
* }
* @apiErrorExample {json} Error
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération des commentaires"
*    }
*/
generalRouter.get('/commentsUser/:user_id', function(req, res) {

  const user_id = req.params.user_id;

  asyncLib.waterfall([
    function(done){
      CommentsBarController.getAll(user_id)
      .then((commentsBars) => {
        done(null, commentsBars)
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des commentaires bars"});
      });
    },
    function(commentsBars, done){
      CommentsBeerController.getAll(user_id)
      .then((commentsBeers) => {
        done(null, commentsBars, commentsBeers)
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des commentaires bières"});
      });
    },
    function(commentsBars, commentsBeers, done){
      CommentsBreweryController.getAll(user_id)
      .then((commentsBrewery) => {
        done(null, commentsBars, commentsBeers, commentsBrewery)
        //return res.status(200).json({"error": false, "commentsBars": commentsBars, "commentsBeers": commentsBeers, "commentsBrewery": commentsBrewery});
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des commentaires brasseries"});
      });
    },
    function(commentsBars, commentsBeers, commentsBrewery, done){
      CommentsUserController.getAll(user_id)
      .then((commentsUsers) => {
        return res.status(200).json({"error": false, "commentsBars": commentsBars, "commentsBeers": commentsBeers, "commentsBrewery": commentsBrewery, "commentsUsers" : commentsUsers});
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des commentaires utilisateurs"});
      });
    }
  ]);
});

/**
* @api {get} research/:data research user, group, bar or brewery
* @apiGroup Generals
* @apiParam {String} data
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "users": [
*        {
*            "admin": false,
*            "id": 1,
*            "email": "d.alayrangues@gmail.com",
*            "name": "dorian",
*            "surname": "alayrangues",
*            "birthDate": "1997-05-22T00:00:00.000Z",
*            "updated_at": "2019-04-14T09:20:46.668Z",
*            "created_at": "2019-04-14T09:20:46.668Z"
*        }
*    ],
*    "groups": [
*        {
*            "id": 1,
*            "name": "group paris",
*            "created_at": "2019-04-14T13:42:47.000Z",
*            "updated_at": "2019-04-14T13:42:47.000Z",
*            "deleted_at": null,
*            "admin_id": 1
*        }
*    ],
*    "bars": [
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
*    ],
*    "brewerys": [
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
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": message
*    }
*/
generalRouter.get('/research/:data', function(req, res) {

  const data = req.params.data;

  asyncLib.waterfall([
    function(done){
      UserController.research(data)
      .then((users) => {
        done(null, users)
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la recherche des utilisateurs"});
      });
    },
    function(users, done){
      BarController.research(data)
      .then((bars) => {
        done(null, users, bars)
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la recherche des bars"});
      });
    },
    function(users, bars, done){
      BreweryController.research(data)
      .then((brewerys) => {
        done(null, users, bars, brewerys)
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la recherche des brasseries"});
      });
    },
    function(users, bars, brewerys, done){
      GroupController.research(data)
      .then((groups) => {
        return res.status(200).json({"error": false, "users": users, "bars": bars, "brewerys": brewerys, "groups": groups}).end();
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la recherche des groupes"});
      });
    }
  ]);
});

/**
* @api {get} getallusergroupbarbrewery getall user, group, bar or brewery
* @apiGroup Generals
* @apiParam {String} data
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "users": [
*        {
*            "admin": false,
*            "id": 1,
*            "email": "d.alayrangues@gmail.com",
*            "name": "dorian",
*            "surname": "alayrangues",
*            "birthDate": "1997-05-22T00:00:00.000Z",
*            "updated_at": "2019-04-14T09:20:46.668Z",
*            "created_at": "2019-04-14T09:20:46.668Z"
*        }
*    ],
*    "groups": [
*        {
*            "id": 1,
*            "name": "group paris",
*            "created_at": "2019-04-14T13:42:47.000Z",
*            "updated_at": "2019-04-14T13:42:47.000Z",
*            "deleted_at": null,
*            "admin_id": 1
*        }
*    ],
*    "bars": [
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
*    ],
*    "brewerys": [
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
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": message
*    }
*/
generalRouter.get('/getallusergroupbarbrewery', function(req, res) {

  const data = req.params.data;

  asyncLib.waterfall([
    function(done){
      UserController.getAll()
      .then((users) => {
        done(null, users)
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la recherche des utilisateurs"});
      });
    },
    function(users, done){
      BarController.getAll()
      .then((bars) => {
        done(null, users, bars)
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la recherche des bars"});
      });
    },
    function(users, bars, done){
      BreweryController.getAll()
      .then((brewerys) => {
        done(null, users, bars, brewerys)
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la recherche des brasseries"});
      });
    },
    function(users, bars, brewerys, done){
      GroupController.getAll()
      .then((groups) => {
        return res.status(200).json({"error": false, "users": users, "bars": bars, "brewerys": brewerys, "groups": groups}).end();
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la recherche des groupes"});
      });
    }
  ]);
});


generalRouter.get('/getallbeertypeofbeer', function(req, res) {

    const data = req.params.data;

    asyncLib.waterfall([
      function(done){
        BeerController.getAll(undefined, undefined, undefined, data, undefined)
        .then((beersBrewery) => {
          if(beersBrewery.length == 0)
            return res.status(400).json({"error": true, "message": "Aucune bière trouvé"});
          done(null, beersBrewery);
        })
        .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des bières"});
        });
      },
      function(beersBrewery, done){
        MenusBeerController.getAll(beersBrewery.id)
        .then((menusBeers) => {
          done(null, beersBrewery, menusBeers)
        })
        .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la recherche des bars"});
        });
      },
      function(beersBrewery, menusBeers, done){
        var bars = [];
        var brewerys = [];

        for(var i = 0; i < menusBeers.length; i++)
          bars.push(menusBeers[i].bar_id);

        for(var i = 0; i < beersBrewery.length; i++)
          brewerys.push(beersBrewery[i].brewery_id);

        return res.status(200).json({"error": false, "bars": bars, "brewerys": brewerys}).end();
      }
    ]);
});

module.exports = generalRouter;
