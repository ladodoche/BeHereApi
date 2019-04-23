const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const Beer = ModelIndex.Beer;

const BeerController = function(){};


////////////////////////////////////////////////////
BeerController.add = function(name, color, origin, description){
  return Beer.create({
    name: name,
    color: color,
    origin: origin,
    description: description
  });
};


//////////////////////////////////////////////////////
BeerController.addTypeOfBeer = function(Beer, typeOfBeer){
  return Beer.addTypeOfBeer(typeOfBeer);
};


////////////////////////////////////////////////////
BeerController.getAll = function(email = undefined, user_id = undefined){
  const options = {
    include: [{
      model: ModelIndex.TypeOfBeer,
      as: 'typeOfBeer'
    }]
  };
  const where = {};

  if(email !== undefined){where.email = email};
  if(user_id !== undefined){where.user_id = user_id};
  options.where = where;

  return Beer.findAll(options);
};


//////////////////////////////////////////////////////
BeerController.getOne = function(beer_id){
  const options = {
    include: [{
      model: ModelIndex.TypeOfBeer,
      as: 'typeOfBeer'
    }]
  };
  const where = {};

  if(beer_id !== undefined){where.id = beer_id};
  options.where = where;

  return Beer.find(options);
}


//////////////////////////////////////////////////////
BeerController.update = function(beer, name, color, origin, description, pathPicture){
  const options = {};
  const where = {};
  const json = {};

  if(name !== undefined){json.name = name}
  if(color !== undefined){json.color = color}
  if(origin !== undefined){json.origin = origin}
  if(description !== undefined){json.description = description}
  if(pathPicture !== undefined){json.pathPicture = pathPicture}
  options.where = where;
  options.timezone = '+02:00';

  return beer.updateAttributes(json);
};

//////////////////////////////////////////////////////
BeerController.delete = function(beer){
  beer.destroy();
};


//////////////////////////////////////////////////////
BeerController.deleteBeer = function(beer, typeOfBeer){
  beer.removeTypeOfBeer(typeOfBeer);
};


module.exports = BeerController;
