const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const Beer = ModelIndex.Beer;

const BeerController = function(){};


////////////////////////////////////////////////////
BeerController.add = function(name, color, origin, description, type_of_beer_id){
  return Beer.create({
    name: name,
    color: color,
    origin: origin,
    description: description,
    type_of_beer_id: type_of_beer_id
  });
};


////////////////////////////////////////////////////
BeerController.getAll = function(name, color, origin, type_of_beer_id = undefined){
  const options = {};
  const where = {};

  if(name !== undefined){where.name = name};
  if(color !== undefined){where.color = color};
  if(origin !== undefined){where.origin = origin};
  if(type_of_beer_id !== undefined){where.type_of_beer_id = type_of_beer_id};
  options.where = where;

  return Beer.findAll(options);
};


//////////////////////////////////////////////////////
BeerController.getOne = function(beer_id){
  const options = {};
  const where = {};

  if(beer_id !== undefined){where.id = beer_id};
  options.where = where;

  return Beer.find(options);
}


////////////////////////////////////////////////////
BeerController.research = function(data){
  const options = {};
  const where = {};
  const or = {};
  or.name = { like: '%' + data + '%' }
  or.color = { like: '%' + data + '%' }
  or.origin = { like: '%' + data + '%' }
  where.or = or;
  options.where = where;

  return Beer.findAll(options);
};


//////////////////////////////////////////////////////
BeerController.update = function(beer, name, color, origin, description, pathPicture, type_of_beer_id){
  const options = {};
  const where = {};
  const json = {};

  if(name !== undefined){json.name = name}
  if(color !== undefined){json.color = color}
  if(origin !== undefined){json.origin = origin}
  if(description !== undefined){json.description = description}
  if(pathPicture !== undefined){json.pathPicture = pathPicture}
  if(type_of_beer_id !== undefined){json.type_of_beer_id = type_of_beer_id}
  options.where = json;
  options.timezone = '+02:00';

  console.log(json);

  return beer.updateAttributes(json);
};

//////////////////////////////////////////////////////
BeerController.delete = function(beer){
  beer.destroy();
};


module.exports = BeerController;
