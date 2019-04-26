const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const OrderMenuBeer = ModelIndex.OrderMenuBeer;
const OrderMenuBeerController = function(){};


////////////////////////////////////////////////////
OrderMenuBeerController.add = function(quantity, reservation_id, menuBeer_id){
  return OrderMenuBeer.create({
    quantity: quantity,
    reservation_id: reservation_id,
    menuBeer_id: menuBeer_id
  });
};


////////////////////////////////////////////////////
OrderMenuBeerController.getAll = function(reservation_id = undefined, menuBeer_id = undefined){
  const options = {};
  const where = {};

  if(reservation_id !== undefined){where.reservation_id = reservation_id};
  if(menuBeer_id !== undefined){where.menuBeer_id = menuBeer_id};
  options.where = where;

  return OrderMenuBeer.findAll(options);
};


//////////////////////////////////////////////////////
OrderMenuBeerController.getOne = function(orderMenuBeer_id){
  const options = {};
  const where = {};

  if(orderMenuBeer_id !== undefined){where.id = orderMenuBeer_id};
  options.where = where;

  return OrderMenuBeer.find(options);
}


//////////////////////////////////////////////////////
OrderMenuBeerController.update = function(orderMenuBeer, quantity){
  const options = {};
  const where = {};
  const json = {};

  if(quantity !== undefined){json.quantity = quantity}
  options.where = where;
  options.timezone = '+02:00';

  return orderMenuBeer.updateAttributes(json);
};


//////////////////////////////////////////////////////
OrderMenuBeerController.delete = function(orderMenuBeer){
  orderMenuBeer.destroy();
};


module.exports = OrderMenuBeerController;
