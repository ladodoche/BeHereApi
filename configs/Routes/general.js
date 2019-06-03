const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const asyncLib = require('async');
const jwt = require('jsonwebtoken');
const auth = require('../auth.js');
const CommentsBarController = controllers.CommentsBarController;
const CommentsBeerController = controllers.CommentsBeerController;
const CommentsBreweryController = controllers.CommentsBreweryController;

const generalRouter = express.Router();
generalRouter.use(bodyParser.json({limit: '10mb'}));

/**
* @api {get} commentsUser/:user_id get all user comments
* @apiGroup Generals
* @apiParam {String} user_id
* @apiSuccessExample {json} Success
*  HTTP/1.1 200 Success
* {
*    "error": false,
*    "commentsBars": [
*        {
*            "id": 1,
*            "text": "J'adore ce bar",
*            "bar_id": 1,
*            "user_id": 1,
*            "created_at": "2019-04-14T13:42:47.000Z",
*            "updated_at": "2019-04-14T13:42:47.000Z",
*            "deleted_at": null
*        }
*    ],
*    "commentsBeers": [
*        {
*            "id": 1,
*            "text": "J'adore cette bière",
*            "beer_id": 1,
*            "user_id": 1,
*            "created_at": "2019-04-14T13:42:47.000Z",
*            "updated_at": "2019-04-14T13:42:47.000Z",
*            "deleted_at": null
*        }
*    ],
*    "commentsBrewery": [
*        {
*            "id": 1,
*            "text": "J'adore cette brasserie",
*            "brewery_id": 1,
*            "user_id": 1,
*            "created_at": "2019-04-14T13:42:47.000Z",
*            "updated_at": "2019-04-14T13:42:47.000Z",
*            "deleted_at": null
*        }
*    ]
* }
* @apiErrorExample {json} Error
*    HTTP/1.1 500 Internal Server Error
*    {
*        "error": true,
*        "message": "Erreur lors de la récupération des commentaires"
*    }
*/
generalRouter.get('/commentsUser/:user_id', function(req, res) {

  const user_id = req.params.user_id;

  asyncLib.waterfall([
    function(done){
      CommentsBarController.getAll(user_id)
      .then((commentsBars) => {
        done(null, commentsBars)
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des commentaires"});
      });
    },
    function(commentsBars, done){
      CommentsBeerController.getAll(user_id)
      .then((commentsBeers) => {
        done(null, commentsBars, commentsBeers)
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des commentaires"});
      });
    },
    function(commentsBars, commentsBeers, done){
      CommentsBreweryController.getAll(user_id)
      .then((commentsBrewery) => {
        return res.status(200).json({"error": false, "commentsBars": commentsBars, "commentsBeers": commentsBeers, "commentsBrewery": commentsBrewery});
      })
      .catch((err) => {
        return res.status(500).json({"error": true, "message": "Erreur lors de la récupération des commentaires"});
      });
    }
  ]);
});

module.exports = generalRouter;
