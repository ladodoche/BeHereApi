const RouteManager = function() { };
const cors = require('cors');

RouteManager.attach = function(app) {
  app.use(cors());
  app.use('/authentificate', require('./authentificate'));
  app.use('/users', require('./user'));
};

module.exports = RouteManager;
