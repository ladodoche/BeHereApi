const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const TypeOfBeerController = controllers.TypeOfBeerController;
const UserController = controllers.UserController;

const typeOfBeerRouter = express.Router();
typeOfBeerRouter.use(bodyParser.json({limit: '10mb'}));


function isAdmin(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"}).end();

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"}).end();
    if (decoded.admin != 1)
      return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"}).end();
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
    if ((decoded.id != req.params.user_id || decoded.id != req.body.user_id) && decoded.admin != 1)
      return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"}).end();
    next();
  });
}

/**
@api {post} typeOfBeers/create add a new type of beer
* @apiGroup TypeOfBeers
* @apiHeader {String} x-access-token
* @apiParam {String} name obligatoire, unique et entre 2 à 200 caractères
* @apiParamExample {json} Input
*  {
*    "name": "Blonde"
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
*        "message": "Erreur lors de la création du type de bière"
*    }
*/
typeOfBeerRouter.post('/create', isAdmin, function(req, res) {
  const name = req.body.name;

  TypeOfBeerController.add(name)
  .then((typeOfBeer) => {
    return res.status(201).json({"error": false});
  })
  .catch((err) => {
    if(err.errors)
      return res.status(400).json({"error": true, "message": err.errors[0].message});
    return res.status(500).json({"error": true, "message": "Erreur lors de la création du type de bière"}).end();
  });
});


/**
@api {get} typeOfBeers/?name=name get all type of beer
* @apiGroup TypeOfBeers
* @apiParam {String} name
* @apiSuccessExample {json}
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "name": "Blonde",
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
*        "message": "Aucun type de bière trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération des types de bières"
*    }
*/
typeOfBeerRouter.get('/', function(req, res) {
  const name = req.body.name;

  TypeOfBeerController.getAll(name)
  .then((typeOfBeers) => {
    if(typeOfBeers.length == 0)
      return res.status(400).json({"error": true, "message": "Aucun type de bière trouvé"}).end();
    return res.status(200).json({"error": false, "typeOfBeer": typeOfBeers});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des types de bières"}).end();
  });
});


/**
@api {get} typeOfBeers/:typeOfBeer_id get type of beer
* @apiGroup TypeOfBeers
* @apiSuccessExample {json}
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*        "id": 1,
*        "name": "Blonde",
*        "created_at": "2019-04-14T13:42:47.000Z",
*        "updated_at": "2019-04-14T13:42:47.000Z",
*        "deleted_at": null
*    }
* }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "Le type de bière n'existe pas"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération du type de bière"
*    }
*/
typeOfBeerRouter.get('/:typeOfBeer_id', function(req, res) {
  const typeOfBeer_id = req.params.typeOfBeer_id;

  TypeOfBeerController.getOne(typeOfBeer_id)
  .then((typeOfBeer) => {
    if(typeOfBeer === undefined || typeOfBeer === null)
      return res.status(400).json({"error": true, "message": "Le type de bière n'existe pas"}).end();
    return res.status(200).json({"error": false, "typeOfBeer": typeOfBeer});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du type de bière"}).end();
  });
});


/**
@api {put} typeOfBeers/update/:typeOfBeer_id update type of beer
* @apiGroup TypeOfBeers
* @apiHeader {String} x-access-token
* @apiParam {String} name unique et entre 2 à 200 caractères
* @apiParamExample {json} Input
*  {
*    "name": "Brune"
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
typeOfBeerRouter.put('/update/:typeOfBeer_id', isAdmin, function(req, res){
  const typeOfBeer_id = req.params.typeOfBeer_id;
  const name = req.body.name;

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
      TypeOfBeerController.update(typeOfBeer, name)
      .then((typeOfBeer) => {
        return res.status(200).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour du type de bière"}).end();
      });
    }
  ]);
});


/**
@api {delete} typeOfBeers/delete/:typeOfBeer_id delete type of beer
* @apiGroup TypeOfBeers
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
*        "message": "Le type de bière n'existe pas"
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
*        "message": "Erreur lors de la récupération du type de bières"
*    }
*/
typeOfBeerRouter.delete('/delete/:typeOfBeer_id', isAdmin, function(req, res){
  const typeOfBeer_id = req.params.typeOfBeer_id;

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
      TypeOfBeerController.delete(typeOfBeer);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});

//////////////////////////////////////////////////////
/**
@api {put} typeOfBeers/:typeOfBeer_id/addUser add link between type of beer and user
* @apiGroup TypeOfBeers
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
typeOfBeerRouter.put('/:typeOfBeer_id/addUser', isAuthenticatedUser, function(req, res) {
  const typeOfBeer_id = req.params.typeOfBeer_id;
  const user_id = req.body.user_id;

  if(typeOfBeer_id === undefined || user_id === undefined)
    return res.status(400).json({"error": true, "message": "Certains paramètres sont manquantent"}).end();

  asyncLib.waterfall([
    function(done){
      console.log("1");
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
      console.log("2");
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
      console.log("3");
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
@api {put} typeOfBeers/:typeOfBeer_id/deleteUser/:user_id delete link between type of beer and user
* @apiGroup TypeOfBeers
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
typeOfBeerRouter.delete('/:typeOfBeer_id/deleteUser/:user_id', isAuthenticatedUser, function(req, res) {
  const typeOfBeer_id = req.params.typeOfBeer_id;
  const user_id = req.params.user_id;

  if(typeOfBeer_id === undefined || user_id === undefined)
    return res.status(400).json({"error": true, "message": "Certains paramètres sont manquantent"}).end();

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
      UserController.deleteUser(user, typeOfBeer);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});

module.exports = typeOfBeerRouter;
