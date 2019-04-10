const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const controllers = require('../../controllers');
const auth = require('../auth.js');
const UserController = controllers.UserController;

const authentificateRouter = express.Router();
authentificateRouter.use(bodyParser.json());

const sha256 = require('js-sha256').sha256;

authentificateRouter.post('/', function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  UserController.login(email, sha256(password))
  .then((user) => {
    if (user === undefined || user === null){
      res.status(404).json({
        "auth": false,
        "message": "Le nom d'utilisateur et le mot de passe que vous avez entrés ne correspondent pas à ceux présents dans nos fichiers. Veuillez vérifier et réessayer"
      });
    }
    else{
      const token = jwt.sign(
        {
          id: user.id,
          admin: user.admin
        },
        auth.secret, {
          expiresIn: 3600 // 1 hours
        }
      );
      res.status(200).json({ "auth": true, "token": token, "user": user});
    }
  })
  .catch((err) => {
    res.status(500).end();
  });
});

module.exports = authentificateRouter;
