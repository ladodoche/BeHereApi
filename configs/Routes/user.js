const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const jwt = require('jsonwebtoken');
const asyncLib = require('async');
const auth = require('../auth.js');
const UserController = controllers.UserController;
const TypeOfBeerController = controllers.TypeOfBeerController;
const BarController = controllers.BarController;
const BreweryController = controllers.BreweryController;
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path')
const sha256 = require('js-sha256').sha256;

const userRouter = express.Router();
userRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedUserAccount(req, res, next) {
  const token = req.headers['x-access-token'];

  if (req.params.user_id == "create") { next(); return; }

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    if ((decoded.id != req.params.user_id) && decoded.admin != 1)
      return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
    next();
  });
}

function isAuthenticatedUser(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"}).end();

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"}).end();
    if ((decoded.id != req.params.user_id && decoded.id != req.body.user_id) && decoded.admin != 1)
      return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"}).end();
    next();
  });
}

/**
@api {post} users/create add a new user
* @apiGroup Users
* @apiParam {String} email obligatoire, unique et avec le bon format
* @apiParam {String} name obligatoire et entre 2 à 200 caractères
* @apiParam {String} surname obligatoire et entre 2 à 200 caractères
* @apiParam {String} password obligatoire, entre 8 et 40 caractères, avec au moins une lettre majuscule, majuscule et un chiffre
* @apiParam {String} checkPassword obligatoire et doit être égale au mot de passe
* @apiParam {Date} birthDate obligatoire et doit être majeur
* @apiParamExample {json} Input
*  {
*    "email": "dogui78930@gmail.com",
*    "name": "dorian",
*    "surname": "alayrangues",
*    "password": "ESGI-tir1997",
*    "checkPassword": "ESGI-tir1997",
*    "birthDate": "1997-05-22"
*  }
* @apiSuccessExample {json} Success
*    HTTP/1.1 201 Created
*    {
*        "error": false,
*        "user": {
*            "admin": false,
*            "id": 1,
*            "email": "d.alayrangues@gmail.com",
*            "name": "dorian",
*            "surname": "alayrangues",
*            "birthDate": "1997-05-22T00:00:00.000Z",
*            "updated_at": "2019-04-14T09:20:46.668Z",
*            "created_at": "2019-04-14T09:20:46.668Z"
*        }
*    }
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
*        "message": "Erreur lors de la création de l'utilisateur"
*    }
*/
userRouter.post('/create', function(req, res) {
  const email = req.body.email;
  const name = req.body.name;
  const surname = req.body.surname;
  const password = req.body.password;
  const checkPassword = req.body.checkPassword;
  const id_phone = req.body.id_phone;
  var birthDate = undefined
  if(req.body.birthDate != undefined)
    birthDate = new Date(req.body.birthDate);

  const regex = RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])');
  if(password.length < 8 || password.length > 40)
    return res.status(400).json({"error": true, "message": "Votre mot de passe doit faire entre 8 et 40 caractères"});
  if(!regex.test(password))
    return res.status(400).json({"error": true, "message": "votre mot de passe doit au moins comporter une lettre minuscule et majuscule ainsi qu'un chiffre"});
  if(password !== checkPassword)
    return res.status(400).json({"error": true, "message": "Vous avez fait une erreur lors de la vérification de votre mot de passe"});

  UserController.add(email, sha256(password), name, surname, birthDate, id_phone)
  .then((user) => {
    delete user['dataValues']["password"];
    return res.status(201).json({"error": false, "user": user});
  })
  .catch((err) => {
    if(err.errors)
      return res.status(400).json({"error": true, "message": err.errors[0].message});
    return res.status(500).json({"error": true, "message": "Erreur lors de la création de l'utilisateur"});
  });
});

/**
@api {get} users/?email=email get all users
* @apiGroup Users
* @apiParam {String} email
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Success
*    {
*        "error": false,
*        "message": [
*              {
*                  "id": 1,
*                  "email": "d.alayrangues@gmail.com",
*                  "name": "dorian",
*                  "surname": "alayrangues",
*                  "birthDate": "1997-05-22T00:00:00.000Z",
*                  "pathPicture": null,
*                  "admin": false,
*                  "created_at": "2019-04-14T09:20:46.000Z",
*                  "updated_at": "2019-04-14T09:20:46.000Z",
*                  "deleted_at": null,
*                  "typeOfBeer": [
*                        {
*                            "id": 2,
*                            "name": "Brune",
*                            "created_at": "2019-04-20T09:42:06.000Z",
*                            "updated_at": "2019-04-20T09:42:06.000Z",
*                            "deleted_at": null,
*                            "user_typeOfBeer": {
*                                "created_at": "2019-04-20T09:44:59.000Z",
*                                "updated_at": "2019-04-20T09:44:59.000Z",
*                                "user_id": 1,
*                                "type_of_beer_id": 2
*                            }
*                        },
*                        {
*                            "id": 3,
*                            "name": "Blanche",
*                            "created_at": "2019-04-20T09:42:12.000Z",
*                            "updated_at": "2019-04-20T09:42:12.000Z",
*                            "deleted_at": null,
*                            "user_typeOfBeer": {
*                                "created_at": "2019-04-20T09:45:01.000Z",
*                                "updated_at": "2019-04-20T09:45:01.000Z",
*                                "user_id": 1,
*                                "type_of_beer_id": 3
*                            }
*                        }
*                    ]
*              }
*        ]
*    }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "Aucun utilisateur trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération des utilisateurs"
*    }
*/
userRouter.get('/', function(req, res) {
  const email = req.query.email;

  UserController.getAll(email)
  .then((users) => {
    if(users.length == 0)
      return res.status(400).json({"error": true, "message": "Aucun utilisateur trouvé"});
    Object.keys(users).forEach(function(key){
      delete users[key]['dataValues']["password"];
    });
    return res.status(200).json({"error": false, "user": users});
  })
  .catch((err) => {
    console.log(err);
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des utilisateurs"});
  });
});

/**
@api {get} users/:user_id get user
* @apiGroup Users
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Success
*    {
*        "error": false,
*        "user": {
*            "admin": false,
*            "id": 1,
*            "email": "dogui78930@gmail.com",
*            "name": "dorian",
*            "surname": "alayrangues",
*            "birthDate": "1997-05-22T00:00:00.000Z",
*            "updated_at": "2019-04-14T09:20:46.668Z",
*            "created_at": "2019-04-14T09:20:46.668Z",
*            "typeOfBeer": [
*                        {
*                            "id": 2,
*                            "name": "Brune",
*                            "created_at": "2019-04-20T09:42:06.000Z",
*                            "updated_at": "2019-04-20T09:42:06.000Z",
*                            "deleted_at": null,
*                            "user_typeOfBeer": {
*                                "created_at": "2019-04-20T09:44:59.000Z",
*                                "updated_at": "2019-04-20T09:44:59.000Z",
*                                "user_id": 1,
*                                "type_of_beer_id": 2
*                            }
*                        },
*                        {
*                            "id": 3,
*                            "name": "Blanche",
*                            "created_at": "2019-04-20T09:42:12.000Z",
*                            "updated_at": "2019-04-20T09:42:12.000Z",
*                            "deleted_at": null,
*                            "user_typeOfBeer": {
*                                "created_at": "2019-04-20T09:45:01.000Z",
*                                "updated_at": "2019-04-20T09:45:01.000Z",
*                                "user_id": 1,
*                                "type_of_beer_id": 3
*                            }
*                        }
*                    ]
*        }
*    }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "L'utilisateur n'existe pas"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération de l'utilisateurs"
*    }
*/
userRouter.get('/:user_id', function(req, res) {
  const user_id = req.params.user_id;

  UserController.getOne(user_id)
  .then((user) => {
    if(user === undefined || user === null){
      return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"});
    }
    delete user['dataValues']["password"];
    return res.status(200).json({"error": false, "user": user});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateurs"});
  });
});

/**
@api {get} users/research/:data research users
* @apiGroup Users
* @apiParam {String} data
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "name": "Le dernier user avant la fin du monde",
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
*        "message": "Aucun utilisateur trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la recherche des utilisateurs"
*    }
*/
////////////////////////////////////////////////////
userRouter.get('/research/:data', function(req, res) {
  const data = req.params.data;

  UserController.research(data)
  .then((users) => {
    if(users === undefined || users === null)
      return res.status(400).json({"error": true, "message": "Aucun utilisateur trouvé"});
    return res.status(200).json({"error": false, "user": users});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la recherche des utilisateurs"});
  });
});

/**
@api {get} users/establishment/:user_id get user
* @apiGroup Users
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Success
*    {
*        "error": false,
*        "establishment": [
*          {
*           "id": 1,
*           "name": "Le dernier bar avant la fin du monde 2",
*           "gpsLatitude": 48,
*           "gpsLongitude": 2.3461672,
*           "earlyHappyHours": "19:00",
*           "lateHappyHours": "02:00",
*           "description": "Coucou",
*           "webSiteLink": "https://www.facebook.com/?ref=tn_tnmn",
*           "facebokLink": null,
*           "twitterLink": null,
*           "instagramLink": null,
*           "created_at": "2019-04-27T11:12:52.000Z",
*           "updated_at": "2019-04-27T11:12:52.000Z",
*           "deleted_at": null,
*           "user_id": 1,
*           "establishment": "bar"
*         }
*       ]
*    }
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
userRouter.get('/establishment/:user_id', function(req, res) {
  const user_id = req.params.user_id;
	var result = [];

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
      BarController.getAll(undefined, user_id)
      .then((bars) => {
          done(null, user, bars);
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du bar"});
      });
    },
    function(user, bars, done){
      BreweryController.getAll(undefined, user_id)
      .then((brewerys) => {
        bars.forEach(function(element) {
          element["dataValues"]["establishment"] = "bar";
          result.push(element);
        });
        brewerys.forEach(function(element) {
          element["dataValues"]["establishment"] = "brewery";
          result.push(element);
        });
        return res.status(200).json({"error": false, "establishment": result});
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la brasserie"});
      });
    }
  ]);
});

/**
@api {put} users/update/:user_id update user
* @apiGroup Users
* @apiHeader {String} x-access-token
* @apiParam {String} email unique et avec le bon format
* @apiParam {String} name entre 2 à 200 caractères
* @apiParam {String} surname et entre 2 à 200 caractères
* @apiParam {Date} birthDate et doit être majeur
* @apiParamExample {json} Input
*  {
*    "email": "dogui78930@gmail.com",
*    "name": "dorian",
*    "surname": "alayrangues",
*    "birthDate": "1997-05-22"
*  }
* @apiSuccessExample {json} Success
*    HTTP/1.1 201 Created
*    {
*        "error": false,
*        "user": {
*            "admin": false,
*            "id": 1,
*            "email": "d.alayrangues@gmail.com",
*            "name": "dorian",
*            "surname": "alayrangues",
*            "birthDate": "1997-05-22T00:00:00.000Z",
*            "pathPicture": null,
*            "updated_at": "2019-04-14T09:21:46.668Z",
*            "created_at": "2019-04-14T09:20:46.668Z"
*            "deleted_at": null
*        }
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
userRouter.put('/update/:user_id', isAuthenticatedUserAccount, function(req, res){
  const user_id = req.params.user_id;
  const email = req.body.email;
  const name = req.body.name;
  const surname = req.body.surname;
  const birthDate = req.body.birthDate;
  var result = new Object();

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
      UserController.update(user, email, name, surname, birthDate)
      .then((user) => {
        delete user["dataValues"]["password"];
        return res.status(201).json({"error": false, "user": user});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour de l'utilisateur"});
      });
    }
  ]);
});

/**
@api {put} users/update/password/:user_id update password user
* @apiGroup Users
* @apiHeader {String} x-access-token
* @apiParam {String} oldPassword égale au mot de passe de l'utilisateur
* @apiParam {String} newPasswordentre 8 et 40 caractères, avec au moins une lettre majuscule, majuscule et un chiffre
* @apiParam {String} checkNewPassword doit être égale au mot de passe
* @apiParamExample {json} Input
* {
*   "oldPassword": "ESGI-tir19970522",
*   "newPassword": "ESGI-tir19970522",
*   "checkNewPassword": "ESGI-tir19970522"
* }
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
userRouter.put('/update/password/:user_id', isAuthenticatedUserAccount, function(req, res){
  const user_id = req.params.user_id;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const checkNewPassword = req.body.checkNewPassword;

  const regex = RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])');
  if(newPassword.length < 8 || newPassword.length > 40)
      return res.status(400).json({"error": true, "message": "Votre mot de passe doit faire entre 8 et 40 caractères"});
  if(!regex.test(newPassword))
    return res.status(400).json({"error": true, "message": "votre mot de passe doit au moins comporter une lettre minuscule et majuscule ainsi qu'un chiffre"});
  if(newPassword !== checkNewPassword)
    return res.status(400).json({"error": true, "message": "Vous avez fait une erreur lors de la vérification de votre nouveau mot de passe"});

  asyncLib.waterfall([
    function(done){
      UserController.getOne(user_id)
      .then((user) => {
        if(user === null || user === undefined)
          return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"});
        if(user.password != sha256(oldPassword))
          return res.status(400).json({"error": true, "message": "Votre mot de passe actuel n'est pas correcte"});
        done(null, user);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"});
      });
    },
    function(user, done){
      UserController.update(user, undefined, undefined, undefined, undefined, undefined, sha256(newPassword))
      .then((user) => {
        return res.status(201).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour de l'utilisateur"});
      });
    }
  ]);

});

/**
@api {delete} users/delete/:user_id delete user
* @apiGroup Users
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
*        "message": "L'utilisateur n'existe pas"
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
*        "message": "Erreur lors de la récupération de l'utilisateurs"
*    }
*/
userRouter.delete('/delete/:user_id', isAuthenticatedUserAccount, function(req, res){
  const user_id = req.params.user_id;

  asyncLib.waterfall([
    function(done){
      UserController.getOne(user_id)
      .then((user) => {
        if(user === null || user === undefined){
          return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"});
        }
        done(null, user);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"});
      });
    },
    function(user, done){
      UserController.delete(user);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});

userRouter.use(fileUpload());
/**
@api {put} users/upload/:user_id upload picture user
* @apiGroup Users
* @apiHeader {String} x-access-token
* @apiParam {File} file Obligatoire, format png ou jpg
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
userRouter.put('/upload/:user_id', isAuthenticatedUserAccount, function(req, res) {
  const user_id = req.params.user_id;
  const fileToUpload = req.files.file;
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
      const ext = fileToUpload.name.substr(fileToUpload.name.lastIndexOf('.') + 1).toLowerCase();
      const regex = new RegExp(' ','g');
      var src_tracks = user.id+"."+ext;
      src_tracks = src_tracks.replace(regex, '_');

      if(fileToUpload === undefined)
        return res.status(400).json({"error": true, "message": "Aucune image à upload"}).end();
      if(ext != "png" && ext != "jpg")
        return res.status(400).json({"error": true, "message": "Format de l'image non géré (png et jpg)"}).end();

      fileToUpload.mv("medias/users/"+src_tracks, function(err) {
        if (err)
          return res.status(400).json({"error": true, "message": "Erreur lors de l'upload"});
        else
          done(null, user, src_tracks);
      });
    },
    function(user, src_tracks, done){
      UserController.update(user, undefined, undefined, undefined, undefined, src_tracks)
      .then((track) => {
        return res.status(201).json({"error": false});
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la sauvegarde du chemin"});
      });
    }
  ])
});

/**
  @api {get} users/download/:user_id download picture user
* @apiGroup Users
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Success
*    {
*        "error": false,
*        "buffer": buffer
*    }
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
userRouter.get('/download/:user_id', function(req, res){
  const user_id = req.params.user_id;
  var pathUsersDefault = path.resolve( __dirname+"/../../medias/users/");

  UserController.getOne(user_id)
  .then((user) => {
    if(user === null || user === undefined)
      return res.status(401).json({"error": true, "message": "L'utilisateur n'existe pas"});
    pathUsers = pathUsersDefault + "\\" + user.pathPicture;

    if (fs.existsSync(pathUsers)){
      const buffer = new Buffer(fs.readFileSync(pathUsers), 'base64');
      res.writeHead(200, {
       'Content-Type': 'image/jpeg',
       'Content-Length': buffer.length
     });
     res.end(buffer);
    }else{
      const buffer = new Buffer(fs.readFileSync(pathUsersDefault + "\\" + 'defaultprofile.png'), 'base64');
      res.writeHead(200, {
       'Content-Type': 'image/png',
       'Content-Length': buffer.length
     });
     res.end(buffer);

  }})
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Image non trouvé sur notre serveur"});
  });
})

//////////////////////////////////////////////////////
/**
@api {put} users/:user_id/addTypeOfBeer add link between type of beer and user
* @apiGroup Users
* @apiHeader {String} x-access-token
* @apiParam {String} typeOfBeer_id
* @apiParamExample {json} Input
*  {
*    "typeOfBeer_id": 1
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
userRouter.put('/:user_id/addTypeOfBeer', isAuthenticatedUser, function(req, res) {
  const user_id = req.params.user_id;
  const typeOfBeer_id = req.body.typeOfBeer_id;

  if(typeOfBeer_id === undefined || user_id === undefined)
    return res.status(400).json({"error": true, "message": "Certains paramètres sont manquant"}).end();

  asyncLib.waterfall([
    function(done){
      TypeOfBeerController.getOne(typeOfBeer_id)
      .then((typeOfBeer) => {
        if(typeOfBeer === null || typeOfBeer === undefined)
          return res.status(400).json({"error": true, "message": "Le type de bière n'existe pas"}).end();
        done(null, typeOfBeer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du type de bière"}).end();
      });
    },
    function(typeOfBeer, done){
      UserController.getOne(user_id)
      .then((user) => {
        if(user === null || user === undefined)
          return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"}).end();
        done(null, typeOfBeer, user);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"}).end();
      });
    },
    function(typeOfBeer, user, done){
      UserController.addTypeOfBeer(user, typeOfBeer)
      .then((TypeOfBeer_User) => {
        return res.status(200).json({"error": false}).end();
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de l'ajout du lien entre l'utilisateur et le type de bière"}).end();
      });
    }
  ]);
});

/**
@api {put} users/:user_id/deleteTypeOfBeer/:typeOfBeer_id delete link between type of beer and user
* @apiGroup Users
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
userRouter.delete('/:user_id/deleteTypeOfBeer/:typeOfBeer_id', isAuthenticatedUser, function(req, res) {
  const typeOfBeer_id = req.params.typeOfBeer_id;
  const user_id = req.params.user_id;

  if(typeOfBeer_id === undefined || user_id === undefined)
    return res.status(400).json({"error": true, "message": "Certains paramètres sont manquant"}).end();

  asyncLib.waterfall([
    function(done){
      TypeOfBeerController.getOne(typeOfBeer_id)
      .then((typeOfBeer) => {
        if(typeOfBeer === null || typeOfBeer === undefined){
          return res.status(400).json({"error": true, "message": "Le type de bière n'existe pas"}).end();
        }
        done(null, typeOfBeer);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du type de bière"}).end();
      });
    },
    function(typeOfBeer, done){
      UserController.getOne(user_id)
      .then((user) => {
        if(user === null || user === undefined)
          return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"}).end();
        done(null, typeOfBeer, user);
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"}).end();
      });
    },
    function(typeOfBeer, user, done){
      UserController.deleteTypeOfBeer(user, typeOfBeer);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});

//////////////////////////////////////////////////////
/**
@api {put} users/:user_id/addBar add link between type of beer and user
* @apiGroup Users
* @apiHeader {String} x-access-token
* @apiParam {String} bar_id
* @apiParamExample {json} Input
*  {
*    "bar_id": 1
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
userRouter.put('/:user_id/addBar', isAuthenticatedUser, function(req, res) {
  const user_id = req.params.user_id;
  const bar_id = req.body.bar_id;

  if(bar_id === undefined || user_id === undefined)
    return res.status(400).json({"error": true, "message": "Certains paramètres sont manquant"}).end();

  asyncLib.waterfall([
    function(done){
      BarController.getOne(bar_id)
      .then((bar) => {
        if(bar === null || bar === undefined)
          return res.status(400).json({"error": true, "message": "Le bar n'existe pas"}).end();
        done(null, bar);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du bar"}).end();
      });
    },
    function(bar, done){
      UserController.getOne(user_id)
      .then((user) => {
        if(user === null || user === undefined)
          return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"}).end();
        done(null, bar, user);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"}).end();
      });
    },
    function(bar, user, done){
      UserController.addBar(user, bar)
      .then((bar_User) => {
        return res.status(200).json({"error": false}).end();
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de l'ajout du lien entre l'utilisateur et le bar"}).end();
      });
    }
  ]);
});

/**
@api {put} users/:user_id/deleteBar/:bar_id delete link between type of beer and user
* @apiGroup Users
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
userRouter.delete('/:user_id/deleteBar/:bar_id', isAuthenticatedUser, function(req, res) {
  const bar_id = req.params.bar_id;
  const user_id = req.params.user_id;

  if(bar_id === undefined || user_id === undefined)
    return res.status(400).json({"error": true, "message": "Certains paramètres sont manquant"}).end();

  asyncLib.waterfall([
    function(done){
      BarController.getOne(bar_id)
      .then((bar) => {
        if(bar === null || bar === undefined){
          return res.status(400).json({"error": true, "message": "Le bar n'existe pas"}).end();
        }
        done(null, bar);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du bar"}).end();
      });
    },
    function(bar, done){
      UserController.getOne(user_id)
      .then((user) => {
        if(user === null || user === undefined)
          return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"}).end();
        done(null, bar, user);
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"}).end();
      });
    },
    function(bar, user, done){
      UserController.deleteBar(user, bar);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});

//////////////////////////////////////////////////////
/**
@api {put} users/:user_id/addBrewery add link between type of beer and user
* @apiGroup Users
* @apiHeader {String} x-access-token
* @apiParam {String} brewery_id
* @apiParamExample {json} Input
*  {
*    "brewery_id": 1
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
userRouter.put('/:user_id/addBrewery', isAuthenticatedUser, function(req, res) {
  const user_id = req.params.user_id;
  const brewery_id = req.body.brewery_id;

  if(brewery_id === undefined || user_id === undefined)
    return res.status(400).json({"error": true, "message": "Certains paramètres sont manquant"}).end();

  asyncLib.waterfall([
    function(done){
      BreweryController.getOne(brewery_id)
      .then((brewery) => {
        if(brewery === null || brewery === undefined)
          return res.status(400).json({"error": true, "message": "La brasserie n'existe pas"}).end();
        done(null, brewery);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la brasserie"}).end();
      });
    },
    function(brewery, done){
      UserController.getOne(user_id)
      .then((user) => {
        if(user === null || user === undefined)
          return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"}).end();
        done(null, brewery, user);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"}).end();
      });
    },
    function(brewery, user, done){
      UserController.addBrewery(user, brewery)
      .then((brewery_User) => {
        return res.status(200).json({"error": false}).end();
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de l'ajout du lien entre l'utilisateur et la brasserie"}).end();
      });
    }
  ]);
});

/**
@api {put} users/:user_id/deleteBrewery/:brewery_id delete link between type of beer and user
* @apiGroup Users
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
userRouter.delete('/:user_id/deleteBrewery/:brewery_id', isAuthenticatedUser, function(req, res) {
  const brewery_id = req.params.brewery_id;
  const user_id = req.params.user_id;

  if(brewery_id === undefined || user_id === undefined)
    return res.status(400).json({"error": true, "message": "Certains paramètres sont manquant"}).end();

  asyncLib.waterfall([
    function(done){
      BreweryController.getOne(brewery_id)
      .then((brewery) => {
        if(brewery === null || brewery === undefined){
          return res.status(400).json({"error": true, "message": "La brasserie n'existe pas"}).end();
        }
        done(null, brewery);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la brasserie"}).end();
      });
    },
    function(brewery, done){
      UserController.getOne(user_id)
      .then((user) => {
        if(user === null || user === undefined)
          return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"}).end();
        done(null, brewery, user);
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"}).end();
      });
    },
    function(brewery, user, done){
      UserController.deleteBrewery(user, brewery);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});

module.exports = userRouter;
