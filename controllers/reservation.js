const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const Reservation = ModelIndex.Reservation;
const ReservationController = function(){};


////////////////////////////////////////////////////
ReservationController.add = function(numberOfPeople, arrivalTime, user_id, bar_id){
  return Reservation.create({
    numberOfPeople: numberOfPeople,
    arrivalTime: arrivalTime,
    user_id: user_id,
    bar_id: bar_id
  });
};


////////////////////////////////////////////////////
ReservationController.getAll = function(user_id = undefined, bar_id = undefined){
  const options = {};
  const where = {};

  if(user_id !== undefined){where.user_id = user_id};
  if(bar_id !== undefined){where.bar_id = bar_id};
  options.where = where;

  return Reservation.findAll(options);
};


//////////////////////////////////////////////////////
ReservationController.getOne = function(reservation_id){
  const options = {};
  const where = {};

  if(reservation_id !== undefined){where.id = reservation_id};
  options.where = where;

  return Reservation.find(options);
}


//////////////////////////////////////////////////////
ReservationController.update = function(reservation, numberOfPeople, arrivalTime, valid){
  const options = {};
  const where = {};
  const json = {};

  if(numberOfPeople !== undefined){json.numberOfPeople = numberOfPeople}
  if(arrivalTime !== undefined){json.arrivalTime = arrivalTime}
  if(valid !== undefined){json.valid = valid}
  options.where = where;
  options.timezone = '+02:00';

  return reservation.updateAttributes(json);
};


//////////////////////////////////////////////////////
ReservationController.delete = function(reservation){
  reservation.destroy();
};


module.exports = ReservationController;
