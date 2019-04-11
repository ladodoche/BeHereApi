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
  var result = new Object();
  const token = req.headers['x-access-token'];

  if (!token){
    result["auth"] = 'Problème lors de l\'authentification: il manque la clé d\'authentification';
    return res.status(401).json({ "error": true, "message": result});
  }

  jwt.verify(token, auth.secret, function(err, decoded) {
    console.log(decoded.secret);
    if (err){
      result["auth"] = 'Problème lors de l\'authentification';
      return res.status(500).json({ "error": true, "message": result});
    }
    next();
  });
}

function isAuthenticatedBarAccount(req, res, next) {
  var result = new Object();
  const token = req.headers['x-access-token'];

console.log("aa");
  console.log(token);

  if (!token){
    result["auth"] = 'Problème lors de l\'authentification: il manque la clé d\'authentification';
    return res.status(401).json({ "error": true, "message": result});
  }

  BarController.getOne(req.params.bar_id)
  .then((bar) => {
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err){
        result["auth"] = 'Problème lors de l\'authentification';
        return res.status(500).json({ "error": true, "message": result});
      }
      if ((decoded.id != bar.user_id) && decoded.admin != 1){
        result["auth"] = 'Vous ne disposez pas des droits nécessairent';
        return res.status(401).json({ "error": true, "message": result});
      }
      next();
    });
  })
  .catch((err) => {
    result["server"] = 'Erreur lors de la récupération du bar';
    return res.status(500).json({"error": true, "message": result});
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

////////////////////////////////////////////////////
barRouter.post('/create', isAuthenticatedBarCreateAccount, function(req, res) {

  const name = req.body.name;
  const gpsLatitude = req.body.gpsLatitude;
  const gpsLongitude = req.body.gpsLongitude;
  const description = req.body.description;
  const webSiteLink = req.body.webSiteLink;
  var result = new Object();

  BarController.add(name, gpsLatitude, gpsLongitude, description, webSiteLink, getUserIdHeader(req))
  .then((bar) => {
    return res.status(201).json({"error": false});
  })
  .catch((err) => {
    if(err.errors){
      err.errors.forEach(function(value){
        if(!result.hasOwnProperty(value.path))
          result[value.path] = value.message;
      });
      return res.status(400).json({"error": true, "message": result});
    }
    result["server"] = 'Erreur lors de la création de votre bar';
    return res.status(500).json({"error": true, "message": result});
  });
});

////////////////////////////////////////////////////
barRouter.get('/', function(req, res) {

  const name = req.body.name;
  const user_id = req.body.user_id;
  var result = new Object();

  BarController.getAll(name, user_id)
  .then((bars) => {
    if(bars.length == 0){
      result["getAll"] = 'Aucun bar trouvé';
      return res.status(400).json({"error": true, "message": result});
    }
    return res.status(200).json({"error": false, "message": bars});
  })
  .catch((err) => {
    result["server"] = 'Erreur lors de la récupération des bars';
    return res.status(500).json({"error": true, "message": result});
  });
});

////////////////////////////////////////////////////
barRouter.get('/:bar_id', function(req, res) {
  const bar_id = req.params.bar_id;
  var result = new Object();

  BarController.getOne(bar_id)
  .then((bar) => {
    if(bar === undefined || bar === null){
      result["getOne"] = 'Le bar n\'existe pas';
      return res.status(400).json({"error": true, "message": result});
    }
    return res.status(200).json({"error": false, "message": bar});
  })
  .catch((err) => {
    result["server"] = 'Erreur lors de la récupération du bar';
    return res.status(500).json({"error": true, "message": result});
  });
});

////////////////////////////////////////////////////
barRouter.put('/update/:bar_id', isAuthenticatedBarAccount, function(req, res){
  const bar_id = req.params.bar_id;
  const name = req.body.name;
  const gpsLatitude = req.body.gpsLatitude;
  const gpsLongitude = req.body.gpsLongitude;
  const description = req.body.description;
  const webSiteLink = req.body.webSiteLink;
  var result = new Object();

  asyncLib.waterfall([
    function(done){
      BarController.getOne(bar_id)
      .then((bar) => {
        if(bar === null || bar === undefined){
          result["getOne"] = 'Le bar n\'existe pas';
          return res.status(400).json({"error": true, "message": result});
        }
        done(null, bar);
      })
      .catch((err) => {
          result["server"] = 'Erreur lors de la récupération du bar';
          return res.status(500).json({"error": true, "message": result});
      });
    },
    function(bar, done){
      BarController.update(bar, name, gpsLatitude, gpsLongitude, description, webSiteLink)
      .then((bar) => {
        return res.status(201).json({"error": false});
      })
      .catch((err) => {
        if(err.errors){
          err.errors.forEach(function(value){
            if(!result.hasOwnProperty(value.path))
              result[value.path] = value.message;
          });
          return res.status(400).json({"error": true, "message": result});
        }
        result["server"] = 'Erreur lors de la mise à jour du bar';
        return res.status(500).json({"error": true, "message": result});
      });
    }
  ]);
});

////////////////////////////////////////////////////
barRouter.delete('/delete/:bar_id', isAuthenticatedBarAccount, function(req, res){
  const bar_id = req.params.bar_id;
  var result = new Object();

  asyncLib.waterfall([
    function(done){
      BarController.getOne(bar_id)
      .then((bar) => {
        if(bar === null || bar === undefined){
          result["getOne"] = 'Le bar n\'existe pas';
          return res.status(400).json({"error": true, "message": result});
        }
        done(null, bar);
      })
      .catch((err) => {
          result["server"] = 'Erreur lors de la récupération du bar';
          return res.status(500).json({"error": true, "message": result});
      });
    },
    function(bar, done){
      BarController.delete(bar);
      return res.status(200).json({"error": false, "message": "Suppression du bar réussit"}).end();
    }
  ]);
});


module.exports = barRouter;
