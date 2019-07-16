const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const BreweryController = controllers.BreweryController;
const BeerController = controllers.BeerController;

const breweryRouter = express.Router();
breweryRouter.use(bodyParser.json({limit: '10mb'}));

function isAuthenticatedBreweryCreateAccount(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  jwt.verify(token, auth.secret, function(err, decoded) {
    if (err)
      return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
    next();
  });
}

function isAuthenticatedBreweryAccount(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token)
    return res.status(401).json({ "error": true, "message": "Problème lors de l'authentification: il manque la clé d'authentification"});

  BreweryController.getOne(req.params.brewery_id)
  .then((brewery) => {
    jwt.verify(token, auth.secret, function(err, decoded) {
      if (err)
        return res.status(500).json({ "error": true, "message": "Problème lors de l'authentification"});
      if ((decoded.id != brewery.user_id) && decoded.admin != 1)
        return res.status(401).json({ "error": true, "message": "Vous ne disposez pas des droits nécessairent"});
      next();
    });
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du brasserie"});
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
@api {post} brewerys/create add a new brewery
* @apiGroup Brewerys
* @apiHeader {String} x-access-token
* @apiParam {String} name obligatoire, unique et entre 2 à 200 caractères
* @apiParam {Double} gpsLatitude obligatoire
* @apiParam {Double} gpsLongitude obligatoire
* @apiParam {Text} description
* @apiParam {String} webSiteLink format url
* @apiParam {String} facebokLink format url
* @apiParam {String} twitterLink format url
* @apiParam {String} instagramLink format url
* @apiParamExample {json} Input
*  {
*    "name": "La dernière brasserie avant la fin du monde",
*    "gpsLatitude": "48.",
*    "gpsLongitude": "2.3461672",
*    "description": "Coucou",
*    "webSiteLink": "https://www.facebook.com/?ref=tn_tnmn",
*    "facebokLink": "https://www.facebook.com/?ref=tn_tnmn",
*    "twitterLink": "https://www.facebook.com/?ref=tn_tnmn",
*    "instagramLink": "https://www.facebook.com/?ref=tn_tnmn"
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
*        "message": "Erreur lors de la création de votre brasserie"
*    }
*/
breweryRouter.post('/create', isAuthenticatedBreweryCreateAccount, function(req, res) {

  const name = req.body.name;
  const gpsLatitude = req.body.gpsLatitude;
  const gpsLongitude = req.body.gpsLongitude;
  var description; if(req.body.description!=""){description=req.body.description}else{description=undefined};
  var webSiteLink; if(req.body.webSiteLink!=""){webSiteLink=req.body.webSiteLink}else{webSiteLink=undefined};
  var facebokLink; if(req.body.facebokLink!=""){facebokLink=req.body.facebokLink}else{facebokLink=undefined};
  var twitterLink; if(req.body.twitterLink!=""){twitterLink=req.body.twitterLink}else{twitterLink=undefined};
  var instagramLink; if(req.body.instagramLink!=""){instagramLink=req.body.instagramLink}else{instagramLink=undefined};

  BreweryController.add(name, gpsLatitude, gpsLongitude, description, webSiteLink, facebokLink, twitterLink, instagramLink, getUserIdHeader(req))
  .then((brewery) => {
    return res.status(201).json({"error": false});
  })
  .catch((err) => {
    if(err.errors)
      return res.status(400).json({"error": true, "message": err.errors[0].message});
    return res.status(500).json({"error": true, "message": "Erreur lors de la création de votre brasserie"});
  });
});

/**
@api {get} brewerys/?name=name&user_id=user_id get all brewerys
* @apiGroup Brewerys

* @apiParam {String} name
* @apiParam {String} user_id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "name": "La dernière brasserie avant la fin du monde",
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
*        "message": "Aucune brasserie trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération des brasseries"
*    }
*/
breweryRouter.get('/', function(req, res) {

  const name = req.query.name;
  const user_id = req.query.user_id;
  const type_of_beer_id = req.query.type_of_beer_id;

  asyncLib.waterfall([
    function(done){
      BeerController.getAll(undefined, undefined, type_of_beer_id)
      .then((beer) => {
        console.log(beer);
        if(beer === null || beer === undefined)
          return res.status(400).json({"error": true, "message": "Aucune bière enregistré de ce type"});
        done(null, beer);
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la bière"});
      });
    },
    function(beer, done){
      BreweryController.getAll(name, user_id, type_of_beer_id)
      .then((brewerys) => {
        console.log(brewerys);
        if(brewerys.length == 0)
          return res.status(400).json({"error": true, "message": "Aucune brasserie trouvé"});
        return res.status(200).json({"error": false, "brewery": brewerys});
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des brasseries"});
      });
    }
  ]);
});

/**
@api {get} brewerys/:brewery_id get brewery
* @apiGroup Brewerys
* @apiSuccessExample {json} Success
* HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": {
*        "id": 1,
*        "name": "La dernière brasserie avant la fin du monde",
*        "gpsLatitude": 48,
*        "gpsLongitude": 2.3461672,
*        "description": "Coucou",
*        "webSiteLink": "https://www.facebook.com/?ref=tn_tnmn",
*        "created_at": "2019-04-14T13:42:47.000Z",
*        "updated_at": "2019-04-14T13:42:47.000Z",
*        "deleted_at": null,
*        "user_id": 1
*    }
* }
* @apiErrorExample {json} Error
*    HTTP/1.1 400 Bad Request
*    {
*        "error": true,
*        "message": "La brasserie n'existe pas"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération de la brasserie"
*    }
*/
breweryRouter.get('/:brewery_id', function(req, res) {
  const brewery_id = req.params.brewery_id;

  BreweryController.getOne(brewery_id)
  .then((brewery) => {
    if(brewery === undefined || brewery === null)
      return res.status(400).json({"error": true, "message": "La brasserie n'existe pas"});
    return res.status(200).json({"error": false, "brewery": brewery});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du brewery"});
  });
});


/**
@api {get} brewerys/research/:data research brewerys
* @apiGroup Brewerys
* @apiParam {String} data
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 Success
* {
*    "error": false,
*    "message": [
*        {
*            "id": 1,
*            "name": "La dernière brasserie avant la fin du monde",
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
*        "message": "Aucune brasserie trouvé"
*    }
*
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la recherche des brasseries"
*    }
*/
////////////////////////////////////////////////////
breweryRouter.get('/research/:data', function(req, res) {
  const data = req.params.data;

  BreweryController.research(data)
  .then((brewerys) => {
    if(brewerys === undefined || brewerys === null)
      return res.status(400).json({"error": true, "message": "Aucune brasserie trouvé"});
    return res.status(200).json({"error": false, "brewery": brewerys});
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la recherche des brasseries"});
  });
});


/**
@api {put} brewerys/update/:brewery_id update brewery
* @apiGroup Brewerys
* @apiHeader {String} x-access-token
* @apiParam {String} name unique et entre 2 à 200 caractères
* @apiParam {Double} gpsLatitude
* @apiParam {Double} gpsLongitude
* @apiParam {Text} description
* @apiParam {String} webSiteLink format url
* @apiParam {String} facebokLink format url
* @apiParam {String} twitterLink format url
* @apiParam {String} instagramLink format url
* @apiParamExample {json} Input
*  {
*    "name": "La dernière brasserie avant la fin du monde",
*    "gpsLatitude": "48.",
*    "gpsLongitude": "2.3461672",
*    "description": "Coucou",
*    "webSiteLink": "https://www.facebook.com/?ref=tn_tnmn",
*    "facebokLink": "https://www.facebook.com/?ref=tn_tnmn",
*    "twitterLink": "https://www.facebook.com/?ref=tn_tnmn",
*    "instagramLink": "https://www.facebook.com/?ref=tn_tnmn"
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
breweryRouter.put('/update/:brewery_id', isAuthenticatedBreweryAccount, function(req, res){
  const brewery_id = req.params.brewery_id;
  const name = req.body.name;
  const gpsLatitude = req.body.gpsLatitude;
  const gpsLongitude = req.body.gpsLongitude;
  var description; if(req.body.description!=""){description=req.body.description}else{description=undefined};
  var webSiteLink; if(req.body.webSiteLink!=""){webSiteLink=req.body.webSiteLink}else{webSiteLink=undefined};
  var facebokLink; if(req.body.facebokLink!=""){facebokLink=req.body.facebokLink}else{facebokLink=undefined};
  var twitterLink; if(req.body.twitterLink!=""){twitterLink=req.body.twitterLink}else{twitterLink=undefined};
  var instagramLink; if(req.body.instagramLink!=""){instagramLink=req.body.instagramLink}else{instagramLink=undefined};

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
      BreweryController.update(brewery, name, gpsLatitude, gpsLongitude, description, webSiteLink, facebokLink, twitterLink, instagramLink)
      .then((brewery) => {
        return res.status(200).json({"error": false});
      })
      .catch((err) => {
        if(err.errors)
          return res.status(400).json({"error": true, "message": err.errors[0].message});
        return res.status(500).json({"error": true, "message": "Erreur lors de la mise à jour de la brasserie"});
      });
    }
  ]);
});

/**
@api {delete} brewerys/delete/:brewery_id delete brewery
* @apiGroup Brewerys
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
*        "message": "La brasserie n'existe pas"
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
*        "message": "Erreur lors de la récupération de la brasserie"
*    }
*/
breweryRouter.delete('/delete/:brewery_id', isAuthenticatedBreweryAccount, function(req, res){
  const brewery_id = req.params.brewery_id;

  asyncLib.waterfall([
    function(done){
      BreweryController.getOne(brewery_id)
      .then((brewery) => {
        if(brewery === null || brewery === undefined){
          return res.status(400).json({"error": true, "message": "La brasserie n'existe pas"});
        }
        done(null, brewery);
      })
      .catch((err) => {
          return res.status(500).json({"error": true, "message": "Erreur lors de la récupération de la brasserie"});
      });
    },
    function(brewery, done){
      BreweryController.delete(brewery);
      return res.status(200).json({"error": false}).end();
    }
  ]);
});

breweryRouter.use(fileUpload());
/**
@api {put} brewerys/upload/:brewery_id upload picture brewery
* @apiGroup Brewerys
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
breweryRouter.put('/upload/:brewery_id', isAuthenticatedBreweryAccount, function(req, res) {
  const brewery_id = req.params.brewery_id;
  const fileToUpload = req.files.file;
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
      const ext = fileToUpload.name.substr(fileToUpload.name.lastIndexOf('.') + 1).toLowerCase();
      const regex = new RegExp(' ','g');
      var src_tracks = brewery.id+"."+ext;
      src_tracks = src_tracks.replace(regex, '_');

      if(fileToUpload === undefined)
        return res.status(400).json({"error": true, "message": "Aucune image à upload"}).end();
      if(ext != "png" && ext != "jpg")
        return res.status(400).json({"error": true, "message": "Format de l'image non géré (png et jpg)"}).end();

      fileToUpload.mv("medias/brewerys/"+src_tracks, function(err) {
        if (err)
          return res.status(400).json({"error": true, "message": "Erreur lors de l'upload"});
        else
          done(null, brewery, src_tracks);
      });
    },
    function(brewery, src_tracks, done){
      BreweryController.update(brewery, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, src_tracks)
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
  @api {get} brewerys/download/:brewery_id download picture brewery
* @apiGroup Brewerys
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
breweryRouter.get('/download/:brewery_id', function(req, res){
  const brewery_id = req.params.brewery_id;
  var pathBrewerysDefault = path.resolve( __dirname+"/../../medias/brewerys/");

  BreweryController.getOne(brewery_id)
  .then((brewery) => {
    if(brewery === null || brewery === undefined)
      return res.status(401).json({"error": true, "message": "La brasserie n'existe pas"});
    pathBrewerys = pathBrewerysDefault + "\\" + brewery.pathPicture;

    if (fs.existsSync(pathBrewerys)){
      const buffer = new Buffer(fs.readFileSync(pathBrewerys), 'base64');
      res.writeHead(200, {
       'Content-Type': 'image/jpeg',
       'Content-Length': buffer.length
     });
     res.end(buffer);
    }else{
      const buffer = new Buffer(fs.readFileSync(pathBrewerysDefault + "\\" + 'defaultprofile.png'), 'base64');
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


module.exports = breweryRouter;
