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
  var result = new Object();
  const email = req.body.email;
  const password = req.body.password;

  UserController.login(email, sha256(password))
  .then((user) => {
    if (user === undefined || user === null)
      return res.status(401).json({ "error": true, "message": "Le nom d'utilisateur et le mot de passe"});
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
      return res.status(200).json({"error": false, "message": token});
    }
  })
  .catch((err) => {
    return res.status(500).json({"error": true, "message": "Erreur lors de la récupération du bar"});
  });
});

module.exports = authentificateRouter;
