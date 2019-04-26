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
  app.use('/commentsBars', require('./commentsBar'));
  app.use('/commentsBrewerys', require('./commentsBrewery'));
  app.use('/notesBeers', require('./notesBeer'));
  app.use('/notesBars', require('./notesBar'));
  app.use('/notesBrewerys', require('./notesBrewery'));
  app.use('/picturesBars', require('./picturesBar'));
  app.use('/picturesBrewerys', require('./picturesBrewery'));
  app.use('/MenusBeers', require('./menusBeer'));
  app.use('/Reservations', require('./reservation'));
  app.use('/OrderMenuBeers', require('./orderMenuBeer'));
};

module.exports = RouteManager;
