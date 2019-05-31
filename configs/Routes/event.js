const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const BreweryController = controllers.BreweryController;
const BarController = controllers.BarController;
const EventController = controllers.EventController;
const dateFormat = require('dateformat');

const eventRouter = express.Router();
eventRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedBreweryOrBarCreate(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    next();
  });
}

function isAuthenticatedBreweryOrBar(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  asyncLib.waterfall([
    function(done){
      BreweryController.getOne(req.params.brewery_id)
      .then((brewery) => {
        jwt.verify(token, auth.secret, function(err, decoded) {
          if (err)
            return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
          if ((decoded.id != brewery.user_id) && decoded.admin != 1)
            return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
          else
            next()
          done(null);
        });
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la brasserie"});
      });
    },
    function(done){
      BarController.getOne(req.params.bar_id)
      .then((bar) => {
        jwt.verify(token, auth.secret, function(err, decoded) {
          if (err)
            return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
          if ((decoded.id != bar.user_id) && decoded.admin != 1)
            return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
          next()
        });
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du bar"});
      });
    }
  ]);
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
@api {post} events/create add a new event
* @apiGroup events
* @apiHeader {String} x-access-token
* @apiParam {String} title obligatoire
* @apiParam {Date} date obligatoire
* @apiParam {Texte} description
* @apiParam {Int} bar_id
* @apiParam {Int} brewery_id
* @apiParamExample {json} Input
*  {
*    "title": "soirée Jazz",
*    "date": "2019-12-12",
*    "description": "",
*    "bar_id": "1",
*    "brewery_id": null
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
*        "message": "Erreur lors de la création de votre évènement"
*    }
*/
eventRouter.post('/create', isAuthenticatedBreweryOrBarCreate, function(req, res) {

  const title = req.body.title;
  const date = req.body.date;
  const description = req.body.description;
  const bar_id = req.body.bar_id;
  const brewery_id = req.body.brewery_id;

  if(bar_id !== null || bar_id !== undefined){
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
        EventController.add(title, date, description, bar.id, undefined)
        .then((event) => {
          return res.status(201).json({"error": false});
        })
        .catch((err) => {
          if(err.errors)
            return res.status(400).json({"error": true, "message": err.errors[0].message});
          return res.status(500).json({"error": true, "message": "Erreur lors de la création de votre évènement"});
        });
      }
    ]);
  }else if(brewery_id !== null || brewery_id !== undefined){
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
        EventController.add(title, date, description, undefined, brewery.id)
        .then((brewery) => {
          return res.status(201).json({"error": false});
        })
        .catch((err) => {
          if(err.errors)
            return res.status(400).json({"error": true, "message": err.errors[0].message});
          return res.status(500).json({"error": true, "message": "Erreur lors de la création de votre évènement"});
        });
      }
    ]);
  }
});

/**
@api {get} events/?bar_id=bar_id&brewery_id=brewery_id get all events
* @apiGroup brewerys
* @apiParam {String} bar_id
* @apiParam {String} brewery_id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "title": "soirée Jazz",
*            "date": "2019-12-12",
*            "description": "",
*            "bar_id": "1",
*            "brewery_id": null
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
*        "message": "Aucun évènement trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération des évènements"
*    }
*/
eventRouter.get('/', function(req, res) {

  const bar_id = req.query.bar_id;
  const brewery_id = req.query.brewery_id;

  EventController.getAll(bar_id, brewery_id)
  .then((events) => {
    if(events.length == 0)
      return res.status(400).json({"error": true, "message": "Aucun évènement trouvé"});
    return res.status(200).json({"error": false, "event": events});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des évènements"});
  });
});

/**
@api {get} events/:events_id get event
* @apiGroup Events
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*            "title": "soirée Jazz",
*            "date": "2019-12-12",
*            "description": "",
*            "bar_id": "1",
*            "brewery_id": null
*            "created_at": "2019-04-14T13:42:47.000Z",
*            "updated_at": "2019-04-14T13:42:47.000Z",
*            "deleted_at": null
*    }
* }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "L'évènement n'existe pas"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération de l'évènement"
*    }
*/
eventRouter.get('/:event_id', function(req, res) {
  const event_id = req.params.event_id;

  EventController.getOne(event_id)
  .then((event) => {
    if(event === undefined || event === null)
      return res.status(400).json({"error": true, "message": "L'évènement n'existe pas"});
    return res.status(200).json({"error": false, "event": event});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'évènement"});
  });
});

/**
@api {put} events/update/:event_id update brewery
* @apiGroup Events
* @apiHeader {String} x-access-token
* @apiParam {String} title obligatoire
* @apiParam {Date} date obligatoire
* @apiParam {Texte} description
* @apiParamExample {json} Input
*  {
*    "title": "soirée Jazz",
*    "date": "2019-12-12",
*    "description": ""
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
eventRouter.put('/update/:event_id', isAuthenticatedBreweryOrBar, function(req, res){
  const event_id = req.params.event_id;
  const title = req.body.title;
  const date = req.body.date;
  const description = req.body.description;

  asyncLib.waterfall([
    function(done){
      EventController.getOne(event_id)
      .then((event) => {
        if(event === null || event === undefined)
          return res.status(400).json({"error": true, "message": "L'évènement n'existe pas"});
        done(null, event);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'évènement"});
      });
    },
    function(event, done){
      EventController.update(event, title, date, description)
      .then((event) => {
        return res.status(200).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour de l'évènement"});
      });
    }
  ]);
});

/**
@api {delete} events/delete/:event_id delete event
* @apiGroup Events
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
*        "message": "L'évènement n'existe pas"
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
*        "message": "Erreur lors de la récupération de l'évènement"
*    }
*/
eventRouter.delete('/delete/:event_id', isAuthenticatedBreweryOrBar, function(req, res){
  const event_id = req.params.event_id;

  asyncLib.waterfall([
    function(done){
      EventController.getOne(event_id)
      .then((event) => {
        if(event === null || event === undefined){
          return res.status(400).json({"error": true, "message": "L'évènement n'existe pas"});
        }
        done(null, event);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'évènement"});
      });
    },
    function(event, done){
      EventController.delete(event);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


module.exports = eventRouter;
