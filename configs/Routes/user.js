const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const jwt = require('jsonwebtoken');
const asyncLib = require('async');
const auth = require('../auth.js');
const UserController = controllers.UserController;
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

  UserController.add(email, sha256(password), name, surname, birthDate)
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
  const fileToUpload = req.files.file
  const ext = fileToUpload.name.substr(fileToUpload.name.lastIndexOf('.') + 1).toLowerCase();
  const regex = new RegExp(' ','g');
  var src_tracks = artist+"_"+title+"."+ext;
  src_tracks = src_tracks.replace(regex, '_');

  if(fileToUpload === undefined)
    return res.status(400).json({"error": true, "message": "Aucune image à upload"}).end();
  if(ext != "png" && ext != "jpg")
    return res.status(400).json({"error": true, "message": "Format de l'image non géré (png et jpg)"}).end();

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
      fileToUpload.mv("../medias/users/"+src_tracks, function(err) {
        if (err)
          return res.status(400).json({"error": true, "message": "Erreur lors de l'upload"});
        else
          done(null, user);
      });
    },
    function(user, done){
      UserController.update(user, undefined, undefined, undefined, undefined, pathPicture)
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
  const pathUsers = path.resolve( __dirname+"/../../../medias/users/");

  UserController.getOne(user_id)
  .then((user) => {
    if(user === null || user === undefined)
      return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"});
    pathUsers += user.pathPicture;
    if (fs.existsSync(pathUsers)){
      const buffer = new Buffer(fs.readFileSync(pathUsers), 'binary');
      res.status(200).end({"error": false, "result": buffer});
    }else
      return res.status(400).json({"error": true, "message": "Image non trouvé sur notre serveur"});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Image non trouvé sur notre serveur"});
  });
})

module.exports = userRouter;
