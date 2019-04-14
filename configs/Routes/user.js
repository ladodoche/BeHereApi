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
  var result = new Object();
  const token = req.headers['x-access-token'];

  if (req.params.user_id == "create") { next(); return; }

  if (!token){
    result["auth"] = 'Problème lors de l\'authentification: il manque la clé d\'authentification';
    return res.status(401).json({ "error": true, "message": result});
  }

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err){
      result["auth"] = 'Problème lors de l\'authentification';
      return res.status(500).json({ "error": true, "message": result});
    }
    if ((decoded.id != req.params.user_id) && decoded.admin != 1){
      result["auth"] = 'Vous ne disposez pas des droits nécessairent';
      return res.status(401).json({ "error": true, "message": result});
    }
    next();
  });
}


/**
@api {post} /users/create add a new user
* @apiGroup Users
* @apiParam {String} email User email
* @apiParam {String} name User name
* @apiParam {String} surname User surname
* @apiParam {String} password User password
* @apiParam {String} checkPassword User checkPassword
* @apiParam {String} birthDate User birthDate
* @apiParamExample {json} Input
*  {
*    "email": "dogui78930@gmail.com",
*    "name": "dorian",
*    "surname": "alayrangues",
*    "password": "ESGI-tir1997",
*    "checkPassword": "ESGI-tir1997",
*    "birthDate": "1997-05-22"
*  }
* @apiSuccess {Number} id User id
* @apiSuccess {String} login User login
* @apiSuccess {Date} updated_at Update date
* @apiSuccess {Date} created_at create date
* @apiSuccessExample {json} Success
*    HTTP/1.1 201 Created
*    {
*        "error": false,
*        "message": {
*            "admin": false,
*            "id": 13,
*            "email": "dogui78930@gmail.com",
*            "name": "dorian",
*            "surname": "alayrangues",
*            "birthDate": "1997-05-22T00:00:00.000Z",
*            "updated_at": "2019-04-11T15:12:41.172Z",
*            "created_at": "2019-04-11T15:12:41.172Z"
*        }
*    }
* @apiErrorExample {json} Register's error
*    HTTP/1.1 400 Bad Request
*    HTTP/1.1 500 Internal Server Error
*/
////////////////////////////////////////////////////
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
    return res.status(201).json({"error": false});
  })
  .catch((err) => {
    if(err.errors)
      return res.status(400).json({"error": true, "message": err.errors[0].message});
    return res.status(500).json({"error": true, "message": "Erreur lors de la création de l'utilisateur"});
  });
});


////////////////////////////////////////////////////
userRouter.get('/', function(req, res) {
  const email = req.body.email;
  var result = new Object();

  UserController.getAll(email)
  .then((users) => {
    if(users.length == 0){
      result["getAll"] = 'Aucun utilisateur trouvé';
      return res.status(400).json({"error": true, "message": result});
    }
    Object.keys(users).forEach(function(key){
      delete users[key]['dataValues']["password"];
    });
    return res.status(200).json({"error": false, "message": users});
  })
  .catch((err) => {
    console.log(err);
    result["server"] = 'Erreur lors de la récupération des utilisateurs';
    return res.status(500).json({"error": true, "message": result});
  });
});

////////////////////////////////////////////////////
userRouter.get('/:user_id', function(req, res) {
  const user_id = req.params.user_id;
  var result = new Object();

  UserController.getOne(user_id)
  .then((user) => {
    if(user === undefined || user === null){
      result["getOne"] = 'L\'utilisateur n\'existe pas';
      return res.status(400).json({"error": true, "message": result});
    }
    delete user['dataValues']["password"];
    return res.status(200).json({"error": false, "message": user});
  })
  .catch((err) => {
    result["server"] = 'Erreur lors de la récupération de l\'utilisateurs';
    return res.status(500).json({"error": true, "message": result});
  });
});

////////////////////////////////////////////////////
userRouter.put('/update/:user_id', isAuthenticatedUserAccount, function(req, res){
  const user_id = req.params.user_id;
  const email = req.body.email;
  const name = req.body.name;
  const surname = req.body.surname;
  const birthDate = req.body.birthDate;
  const pathPicture = req.body.pathPicture;
  var result = new Object();

  asyncLib.waterfall([
    function(done){
      UserController.getOne(user_id)
      .then((user) => {
        if(user === null || user === undefined){
          result["getOne"] = 'L\'utilisateur n\'existe pas';
          return res.status(400).json({"error": true, "message": result});
        }
        done(null, user);
      })
      .catch((err) => {
          result["server"] = 'Erreur lors de la récupération de l\'utilisateur';
          return res.status(500).json({"error": true, "message": result});
      });
    },
    function(user, done){
      UserController.update(user, email, name, surname, birthDate, pathPicture)
      .then((user) => {
        delete user['dataValues']["password"];
        result["user"] = user;
        return res.status(201).json({"error": false, "message": result});
      })
      .catch((err) => {
        if(err.errors){
          err.errors.forEach(function(value){
            if(!result.hasOwnProperty(value.path))
              result[value.path] = value.message;
          });
          return res.status(400).json({"error": true, "message": result});
        }
        result["server"] = 'Erreur lors de la mise à jour de l\'utilisateur';
        return res.status(500).json({"error": true, "message": result});
      });
    }
  ]);
});

userRouter.put('/update/password/:user_id', isAuthenticatedUserAccount, function(req, res){
  const user_id = req.params.user_id;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const checkNewPassword = req.body.checkNewPassword;
  var result = new Object();

  const regex = RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])');
  if(newPassword.length < 8 || newPassword.length > 40){
    result["newPassword"] = 'Votre mot de passe doit faire entre 8 et 40 caractères';
    return res.status(400).json({"error": true, "message": result});
  }
  if(!regex.test(newPassword)){
    result["newPassword"] = 'votre mot de passe doit au moins comporter une lettre minuscule et majuscule ainsi qu\'un chiffre';
    return res.status(400).json({"error": true, "message": result});
  }
  if(newPassword !== checkNewPassword) {
    result["checkNewPassword"] = 'Vous avez fait une erreur lors de la vérification de votre nouveau mot de passe';
    return res.status(400).json({"error": true, "message": result});
  }

  asyncLib.waterfall([
    function(done){
      UserController.getOne(user_id)
      .then((user) => {
        if(user === null || user === undefined){
          result["getOne"] = 'L\'utilisateur n\'existe pas';
          return res.status(400).json({"error": true, "message": result});
        }
        if(user.password != sha256(oldPassword)){
          result["oldPassword"] = 'Votre mot de passe actuel n\'est pas correcte';
          return res.status(400).json({"error": true, "message": result});
        }
        done(null, user);
      })
      .catch((err) => {
          result["server"] = 'Erreur lors de la récupération de l\'utilisateur';
          return res.status(500).json({"error": true, "message": result});
      });
    },
    function(user, done){
      UserController.update(user, undefined, undefined, undefined, undefined, undefined, sha256(newPassword))
      .then((user) => {
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
        result["server"] = 'Erreur lors de la mise à jour de l\'utilisateur';
        return res.status(500).json({"error": true, "message": result});
      });
    }
  ]);

});

////////////////////////////////////////////////////
userRouter.delete('/delete/:user_id', isAuthenticatedUserAccount, function(req, res){
  const user_id = req.params.user_id;
  var result = new Object();

  asyncLib.waterfall([
    function(done){
      UserController.getOne(user_id)
      .then((user) => {
        if(user === null || user === undefined){
          result["getOne"] = 'L\'utilisateur n\'existe pas';
          return res.status(400).json({"error": true, "message": result});
        }
        done(null, user);
      })
      .catch((err) => {
          result["server"] = 'Erreur lors de la récupération de l\'utilisateur';
          return res.status(500).json({"error": true, "message": result});
      });
    },
    function(user, done){
      UserController.delete(user);
      return res.status(200).json({"error": false, "message": "Suppression de l'utilisateur réussit"}).end();
    }
  ]);
});

userRouter.use(fileUpload());
////////////////////////////////////////////////////
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
        if(user === null || user === undefined){
          result["getOne"] = 'L\'utilisateur n\'existe pas';
          return res.status(400).json({"error": true, "message": result});
        }
        done(null, user);
      })
      .catch((err) => {
          result["server"] = 'Erreur lors de la récupération de l\'utilisateur';
          return res.status(500).json({"error": true, "message": result});
      });
    },
    function(user, done){
      fileToUpload.mv("../medias/users/"+src_tracks, function(err) {
        if (err){
          result["server"] = "Erreur lors de l'upload";
          return res.status(400).json({"error": true, "message": result});
        }
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
        result["server"] = 'Erreur lors de la sauvegarde du chemin';
        return res.status(500).json({"error": true, "message": result});
      });
    }
  ])
});

userRouter.get('/download/:user_id', function(req, res){
  const user_id = req.params.user_id;
  const pathUsers = path.resolve( __dirname+"/../../../medias/users/");

  UserController.getOne(user_id)
  .then((user) => {
    pathUsers += user.pathPicture;
    if (fs.existsSync(pathUsers)){
      const buffer = new Buffer(fs.readFileSync(pathTrack), 'binary');
      res.status(200).end({"error": false, "message": buffer});
    }else {
      result["getOne"] = 'Image non trouvé sur notre serveur';
      return res.status(404).json({"error": true, "message": result});
    }
  })
  .catch((err) => {
    result["server"] = 'Image non trouvé sur notre serveur';
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la musique"});
  });
})


module.exports = userRouter;
