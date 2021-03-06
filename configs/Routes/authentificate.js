const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const controllers = require('../../controllers');
const auth = require('../auth.js');
const asyncLib = require('async');
const UserController = controllers.UserController;
const BarController = controllers.BarController;
const BreweryController = controllers.BreweryController;

const authentificateRouter = express.Router();
authentificateRouter.use(bodyParser.json());

const sha256 = require('js-sha256').sha256;


/**
@api {post} authentificate/ user authentificate
* @apiGroup Authentificate
* @apiParam {String} email User email
* @apiParam {String} password User password
* @apiParamExample {json} Input
*  {
*    "email": "dogui78930@gmail.com",
*    "password": "ESGI-tir1997"
*  }
* @apiSuccessExample {json} Success
*    HTTP/1.1 201 Created
* {
*    "error": false,
*    "user": {
*        "id": 1,
*        "email": "d.alayrangues@gmail.com",
*        "name": "dorian",
*        "surname": "alayrangues",
*        "birthDate": "1997-05-22T00:00:00.000Z",
*        "pathPicture": null,
*        "admin": false,
*        "created_at": "2019-04-14T09:20:46.000Z",
*        "updated_at": "2019-04-14T09:20:46.000Z",
*        "deleted_at": null,
*        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWRtaW4iOmZhbHNlLCJpYXQiOjE1NTUyMzQyMTgsImV4cCI6MTU1NTI3MDIxOH0.25NU-sPEtY7Rd-PuVL5EZkESn5Tz_t1H3aL7IVNbuzo"
*    }
* }
* @apiErrorExample {json} Error
*    HTTP/1.1 401 Unauthorized
*    {
*        "error": true
*        "message": "L'email n'existe pas ou l'email et le mot de passe ne correspondent pas"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true
*        "message": "Erreur lors de la récupération de l'utilisateur"
*    }
*/
authentificateRouter.post('/', function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  asyncLib.waterfall([
    function(done){
      UserController.login(email, sha256(password))
      .then((user) => {
        if (user === undefined || user === null)
          return res.status(401).json({ "error": true, "message": "L'email n'existe pas ou l'email et le mot de passe ne correspondent pas"});
        else
          done(null, user)
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"});
      });
    },
    function(user, done){
      console.log('1');
      BarController.getAll(undefined, user.id)
      .then((bar) => {
        if(bar.length == 0)
          done(null, user, false);
        else
          done(null, user, true);
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des bars"});
      });
    },
    function(user, bar_status, done){
      console.log('2');
      BreweryController.getAll(undefined, user.id)
      .then((brewery) => {
        if(brewery.length == 0)
          done(null, user, bar_status, false);
        else
          done(null, user, bar_status, true);
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des brasseries"});
      });
    },
    function(user, bar_status, brewery_status, done){
      const token = jwt.sign(
        {
          id: user.id,
          admin: user.admin,
          barman: bar_status,
          breweryman: brewery_status,
        },
        auth.secret, {
          expiresIn: 36000 // 10 hours
        }
      );
      delete user["dataValues"]["password"];
      user["dataValues"]["token"] = token;
      return res.status(200).json({"error": false, "user": user}).end();
    }
  ]);
});

authentificateRouter.get('/', function(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    return res.status(200).json({ "error": false});
  });
});

module.exports = authentificateRouter;
