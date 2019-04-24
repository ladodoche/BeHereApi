const ModelIndex  = require('../models');
const TypeOfBeer = ModelIndex.TypeOfBeer;
const User = ModelIndex.User;
const Op = ModelIndex.Sequelize.Op;
const TypeOfBeerController = function(){};


//////////////////////////////////////////////////////
TypeOfBeerController.add = function(name){
  return TypeOfBeer.create({
    name: name
  });
};


//////////////////////////////////////////////////////
TypeOfBeerController.update = function(typeOfBeer, typeOfBeer_id, name, pathPicture){
  const options = {};
  const where = {};
  const json = {};

  if(typeOfBeer_id !== undefined){where.id = typeOfBeer_id};
  if(name !== undefined){json.name = name}
  if(pathPicture !== undefined){json.pathPicture = pathPicture}
  options.where = where;
  options.timezone = '+02:00';

  return typeOfBeer.updateAttributes(json);
};


//////////////////////////////////////////////////////
TypeOfBeerController.getAll = function(name) {
  const options = {};
  const where = {};

  if(name !== undefined){where.name = name}
  options.where = where;

  return TypeOfBeer.findAll(options);
};


//////////////////////////////////////////////////////
TypeOfBeerController.getOne = function(typeOfBeerId){
  const options = {};
  const where = {};

  if(typeOfBeerId !== undefined){where.id = typeOfBeerId};
  options.where = where;

  return TypeOfBeer.find(options);
};


//////////////////////////////////////////////////////
TypeOfBeerController.delete = function(typeOfBeer){
  typeOfBeer.destroy();
};

module.exports = TypeOfBeerController
