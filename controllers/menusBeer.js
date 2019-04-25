const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const MenusBeer = ModelIndex.MenusBeer;
const MenusBeerController = function(){};


////////////////////////////////////////////////////
MenusBeerController.add = function(price, beer_id, bar_id){
  return MenusBeer.create({
    price: price,
    beer_id: beer_id,
    bar_id: bar_id
  });
};


////////////////////////////////////////////////////
MenusBeerController.getAll = function(beer_id = undefined, bar_id = undefined){
  const options = {};
  const where = {};

  if(beer_id !== undefined){where.beer_id = beer_id};
  if(bar_id !== undefined){where.bar_id = bar_id};
  options.where = where;

  return MenusBeer.findAll(options);
};


//////////////////////////////////////////////////////
MenusBeerController.getOne = function(menusBeer_id){
  const options = {};
  const where = {};

  if(menusBeer_id !== undefined){where.id = menusBeer_id};
  options.where = where;

  return MenusBeer.find(options);
}


//////////////////////////////////////////////////////
MenusBeerController.update = function(menusBeer, price, hidden){
  const options = {};
  const where = {};
  const json = {};

  if(price !== undefined){json.price = price}
  if(hidden !== undefined){json.hidden = hidden}
  options.where = where;
  options.timezone = '+02:00';

  return menusBeer.updateAttributes(json);
};


//////////////////////////////////////////////////////
MenusBeerController.delete = function(menusBeer){
  menusBeer.destroy();
};


module.exports = MenusBeerController;
