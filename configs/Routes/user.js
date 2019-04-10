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
  if (req.params.user_id == "create") { next(); return; }

  var token = req.headers['x-access-token'];
  if (!token)
    return res.status(401).json({ "auth": "false", "message": "Problème lors de l'authentification" });

  jwt.verify(token, auth.secret, function(err, decoded) {
    console.log(decoded.admin);
    if (err)
      return res.status(500).json({ "auth": "false", "message": "Problème lors de l'authentification" });
    if ((decoded.id != req.params.user_id) && decoded.admin != 1)
      return res.status(401).json({ "auth": "false", "message": "Vous ne disposez pas des droits nécessairent"})
    next();
  });
}


userRouter.use(fileUpload());
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
  var result = new Object();

  const regex = RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])');
  if(password.length < 8 || password.length > 40){
    result["password"] = 'Votre mot de passe doit faire entre 8 et 40 caractères';
    return res.status(400).json({"error": true, "message": result});
  }
  if(!regex.test(password)){
    result["password"] = 'votre mot de passe doit au moins comporter une lettre minuscule et majuscule ainsi qu\'un chiffre';
    return res.status(400).json({"error": true, "message": result});
  }
  if(password !== checkPassword){
    result["checkPassword"] = 'Vous avez fait une erreur lors de la vérification de votre mot de passe';
    return res.status(400).json({"error": true, "message": result});
  }

  UserController.add(email, sha256(password), name, surname, birthDate)
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
    result["server"] = 'Erreur lors de la création de l\'utilisateur';
    return res.status(500).json({"error": true, "message": result});
  });
});


////////////////////////////////////////////////////
userRouter.get('/', function(req, res) {
  const email = req.body.login;
  var result = new Object();

  UserController.getAll(email)
  .then((users) => {
    if(users.length == 0){
      result["getAll"] = 'Aucun utilisateur trouvé';
      return res.status(400).json({"error": true, "message": result});
    }
    return res.status(200).json({"error": false, "result": users});
  })
  .catch((err) => {
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
    return res.status(200).json({"error": false, "result": user});
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
      return res.status(200).json({"error": false, "result": "Suppression de l'utilisateur réussit"}).end();
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
      res.status(200).end({"error": true, "result": buffer});
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
