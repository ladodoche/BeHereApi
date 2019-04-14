const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const controllers = require('../../controllers');
const auth = require('../auth.js');
const UserController = controllers.UserController;

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
authentificateRouter.post('/', function(req, res) {
  var result = new Object();
  const email = req.body.email;
  const password = req.body.password;

  UserController.login(email, sha256(password))
  .then((user) => {
    if (user === undefined || user === null)
      return res.status(401).json({ "error": true, "message": "L'email n'existe pas ou l'email et le mot de passe ne correspondent pas"});
    else{
      const token = jwt.sign(
        {
          id: user.id,
          admin: user.admin
        },
        auth.secret, {
          expiresIn: 36000 // 10 hours
        }
      );
      delete user["dataValues"]["password"];
      user["dataValues"]["token"] = token;
      return res.status(200).json({"error": false, "user": user});
    }
  })
  .catch((err) => {
    console.log(err);
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"});
  });
});

module.exports = authentificateRouter;
