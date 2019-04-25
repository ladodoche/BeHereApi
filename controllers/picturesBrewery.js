const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const PicturesBrewery = ModelIndex.PicturesBrewery;
const PicturesBreweryController = function(){};


////////////////////////////////////////////////////
PicturesBreweryController.add = function(pathPicture, brewery_id){
  return PicturesBrewery.create({
    pathPicture: pathPicture,
    brewery_id: brewery_id
  });
};


////////////////////////////////////////////////////
PicturesBreweryController.getAll = function(brewery_id = undefined){
  const options = {};
  const where = {};

  if(brewery_id !== undefined){where.brewery_id = user_id};
  options.where = where;

  return PicturesBrewery.findAll(options);
};


//////////////////////////////////////////////////////
PicturesBreweryController.getOne = function(picturesBrewery_id){
  const options = {};
  const where = {};

  if(picturesBrewery_id !== undefined){where.id = picturesBrewery_id};
  options.where = where;

  return PicturesBrewery.find(options);
}


//////////////////////////////////////////////////////
PicturesBreweryController.update = function(picturesBrewery, pathPicture){
  const options = {};
  const where = {};
  const json = {};

  if(pathPicture !== undefined){json.pathPicture = pathPicture}
  options.where = where;
  options.timezone = '+02:00';

  return picturesBrewery.updateAttributes(json);
};


//////////////////////////////////////////////////////
PicturesBreweryController.delete = function(picturesBrewery){
  picturesBrewery.destroy();
};


module.exports = PicturesBreweryController;
