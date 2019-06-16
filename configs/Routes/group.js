const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const GroupController = controllers.GroupController;
const UserController = controllers.UserController;

const groupRouter = express.Router();
groupRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedGroupCreateAccount(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    next();
  });
}

function isAuthenticatedGroupAccount(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  GroupController.getOne(req.params.group_id)
  .then((group) => {
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != group.admin_id) && decoded.admin != 1)
        return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
      next();
    });
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du group"});
  });
}

function isAuthenticatedUserGroupAccount(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  GroupController.getOne(req.params.group_id)
  .then((group) => {
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      var a = false
      for(var i = 0; i < group.user.length; i++)
        if(group.user[i].id == decoded.id && req.params.user_id == decoded.id)
          a = true;
      console.log(a);
      if ( a == false && (decoded.id != group.admin_id) && decoded.admin != 1 )
        return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
      next();
    });
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du group"});
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

/**
@api {post} groups/create add a new group
* @apiGroup Groups
* @apiHeader {String} x-access-token
* @apiParam {String} name obligatoire, entre 2 à 200 caractères
* @apiParamExample {json} Input
*  {
*    "name": "group paris"
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
*        "message": "Erreur lors de la création de votre groupe"
*    }
*/
groupRouter.post('/create', isAuthenticatedGroupCreateAccount, function(req, res) {
  const name = req.body.name;

  asyncLib.waterfall([
    function(done){
      GroupController.add(name, getUserIdHeader(req))
      .then((group) => {
        done(null, group);
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la création de votre groupe"});
      });
    },
    function(group, done){
      UserController.getOne(getUserIdHeader(req))
      .then((user) => {
        if(user === undefined || user === null)
          return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"});
        done(null, group, user);
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la création de l'utilisateur"});
      });
    },
    function(group, user, done){
      GroupController.addUser(group, user)
      .then((user_Group) => {
        return res.status(200).json({"error": false}).end();
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de l'ajout du lien entre le groupe et l'utilisateur'"}).end();
      });
    }
  ]);
});

/**
@api {get} groups/?name=name&admin_id=admin_id get all groups
* @apiGroup Groups
* @apiParam {String} name
* @apiParam {String} admin_id
* @apiParam {String} user_id
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "name": "group paris",
*            "created_at": "2019-04-14T13:42:47.000Z",
*            "updated_at": "2019-04-14T13:42:47.000Z",
*            "deleted_at": null,
*            "admin_id": 1
*        }
*    ]
* }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "Aucun groupe trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération des groupes"
*    }
*/
groupRouter.get('/', function(req, res) {

  const name = req.query.name;
  const admin_id = req.query.admin_id;
  const user_id = req.query.user_id;

  GroupController.getAll(name, admin_id, user_id)
  .then((groups) => {
    if(groups.length == 0)
      return res.status(400).json({"error": true, "message": "Aucun groupe trouvé"});
    return res.status(200).json({"error": false, "group": groups});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des groupes"});
  });
});

/**
@api {get} groups/:group_id get group
* @apiGroup Groups
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*            "id": 1,
*            "name": "group paris",
*            "created_at": "2019-04-14T13:42:47.000Z",
*            "updated_at": "2019-04-14T13:42:47.000Z",
*            "deleted_at": null,
*            "admin_id": 1
*    }
* }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "Le groupe n'existe pas"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération du groupe"
*    }
*/
groupRouter.get('/:group_id', function(req, res) {
  const group_id = req.params.group_id;

  GroupController.getOne(group_id)
  .then((group) => {
    if(group === undefined || group === null)
      return res.status(400).json({"error": true, "message": "Le group n'existe pas"});
    return res.status(200).json({"error": false, "group": group});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du group"});
  });
});


/**
@api {put} groups/update/:group_id update group
* @apiGroup Groups
* @apiHeader {String} x-access-token
* @apiParam {String} name et entre 2 à 200 caractères
* @apiParamExample {json} Input
*  {
*            "id": 1,
*            "name": "group paris",
*            "created_at": "2019-04-14T13:42:47.000Z",
*            "updated_at": "2019-04-14T13:42:47.000Z",
*            "deleted_at": null,
*            "admin_id": 1
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
groupRouter.put('/update/:group_id', isAuthenticatedGroupAccount, function(req, res){
  const group_id = req.params.group_id;
  const name = req.body.name;

  asyncLib.waterfall([
    function(done){
      GroupController.getOne(group_id)
      .then((group) => {
        if(group === null || group === undefined)
          return res.status(400).json({"error": true, "message": "Le groupe n'existe pas"});
        done(null, group);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du groupe"});
      });
    },
    function(group, done){
      GroupController.update(group, name)
      .then((group) => {
        return res.status(200).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour du groupe"});
      });
    }
  ]);
});

/**
@api {delete} groups/delete/:group_id delete group
* @apiGroup Groups
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
*        "message": "Le groupe n'existe pas"
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
*        "message": "Erreur lors de la récupération du groupe"
*    }
*/
groupRouter.delete('/delete/:group_id', isAuthenticatedGroupAccount, function(req, res){
  const group_id = req.params.group_id;

  asyncLib.waterfall([
    function(done){
      GroupController.getOne(group_id)
      .then((group) => {
        if(group === null || group === undefined){
          return res.status(400).json({"error": true, "message": "Le groupe n'existe pas"});
        }
        done(null, group);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du groupe"});
      });
    },
    function(group, done){
      GroupController.delete(group);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


//////////////////////////////////////////////////////
/**
@api {put} groups/:group_id/addUser add link between user and group
* @apiGroup Groups
* @apiHeader {String} x-access-token
* @apiParam {String} user_id
* @apiParamExample {json} Input
*  {
*    "user_id": 1
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
groupRouter.put('/:group_id/addUser', isAuthenticatedGroupAccount, function(req, res) {
  const group_id = req.params.group_id;
  const user_id = req.body.user_id;

  if(user_id === undefined || group_id === undefined)
    return res.status(400).json({"error": true, "message": "Certains paramètres sont manquant"}).end();

  asyncLib.waterfall([
    function(done){
      UserController.getOne(user_id)
      .then((user) => {
        if(user === null || user === undefined)
          return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"}).end();
        done(null, user);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"}).end();
      });
    },
    function(user, done){
      GroupController.getOne(group_id)
      .then((group) => {
        if(group === null || group === undefined)
          return res.status(400).json({"error": true, "message": "Le groupe n'existe pas"}).end();
        done(null, user, group);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du groupe"}).end();
      });
    },
    function(user, group, done){
      GroupController.addUser(group, user)
      .then((user_Group) => {
        return res.status(200).json({"error": false}).end();
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de l'ajout du lien entre le groupe et l'utilisateur'"}).end();
      });
    }
  ]);
});

/**
@api {put} groups/:group_id/deleteUser/:user_id delete link between user and group
* @apiGroup Groups
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
groupRouter.delete('/:group_id/deleteUser/:user_id', isAuthenticatedUserGroupAccount , function(req, res) {
  const user_id = req.params.user_id;
  const group_id = req.params.group_id;

  if(group_id === undefined || user_id === undefined)
    return res.status(400).json({"error": true, "message": "Certains paramètres sont manquant"}).end();

  asyncLib.waterfall([
    function(done){
      UserController.getOne(user_id)
      .then((user) => {
        if(user === null || user === undefined)
          return res.status(400).json({"error": true, "message": "L'utilisateur n'existe pas"}).end();
        done(null, user);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de l'utilisateur"}).end();
      });
    },
    function(user, done){
      console.log("a");
      GroupController.getOne(group_id)
      .then((group) => {
        if(group === null || group === undefined)
          return res.status(400).json({"error": true, "message": "Le groupe n'existe pas"}).end();
        done(null, user, group);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du groupe"}).end();
      });
    },
    function(user, group, done){
      console.log("b");
      GroupController.deleteUser(group, user);
        console.log("c");
      return res.status(200).json({"error": false}).end();
    }
  ]);
});


module.exports = groupRouter;
