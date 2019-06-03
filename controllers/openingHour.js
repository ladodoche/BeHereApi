const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const OpeningHour = ModelIndex.OpeningHour;

const OpeningHourController = function(){};


////////////////////////////////////////////////////
OpeningHourController.add = function(day, opening, closing, earlyHappyHour, lateHappyHour, bar_id){
  return OpeningHour.create({
    day: day,
    opening: opening,
    closing: closing,
    earlyHappyHour: earlyHappyHour,
    lateHappyHour: lateHappyHour,
    bar_id: bar_id
  });
};

////////////////////////////////////////////////////
OpeningHourController.getAll = function(day, bar_id){
  const options = {};
  const where = {};

  if(day !== undefined){where.day = day};
  if(bar_id !== undefined){where.bar_id = bar_id};
  options.where = where;
  return OpeningHour.findAll(options);
};


//////////////////////////////////////////////////////
OpeningHourController.getOne = function(openingHour_id){
  const options = {};
  const where = {};

  if(openingHour_id !== undefined){where.id = openingHour_id};
  options.where = where;

  return OpeningHour.find(options);
}


//////////////////////////////////////////////////////
OpeningHourController.update = function(openingHour, day, opening, closing, earlyHappyHour, lateHappyHour){
  const options = {};
  const where = {};
  const json = {};

  if(day !== undefined){json.day = day}
  if(opening !== undefined){json.opening = opening}
  if(closing !== undefined){json.closing = closing}
  if(earlyHappyHour !== undefined){json.earlyHappyHour = earlyHappyHour}
  if(lateHappyHour !== undefined){json.lateHappyHour = lateHappyHour}
  options.where = where;
  options.timezone = '+02:00';

  return openingHour.updateAttributes(json);
};

//////////////////////////////////////////////////////
OpeningHourController.delete = function(openingHour){
  openingHour.destroy();
};


module.exports = OpeningHourController;
