const RouteManager = function() { };
const cors = require('cors');

RouteManager.attach = function(app) {
  app.use(cors());
  app.use('/authentificate', require('./authentificate'));
  app.use('/users', require('./user'));
  app.use('/bars', require('./bar'));
  app.use('/brewerys', require('./brewery'));
  app.use('/typeOfBeers', require('./typeOfBeer'));
  app.use('/beers', require('./beer'));
  app.use('/commentsBeers', require('./commentsBeer'));
  app.use('/notesBeers', require('./notesBeer'));
};

module.exports = RouteManager;
