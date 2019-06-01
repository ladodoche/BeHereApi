const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const Event = ModelIndex.Event;

const EventController = function(){};
const dateFormat = require('dateformat');

////////////////////////////////////////////////////
EventController.add = function(title, startDate, endDate, description, bar_id, brewery_id){
  return Event.create({
    title: title,
    startDate: startDate,
    endDate: endDate,
    description: description,
    bar_id : bar_id,
    brewery_id: brewery_id
  });
};


////////////////////////////////////////////////////
EventController.getAll = function(bar_id = undefined, brewery_id = undefined){
  const options = {
    include: [{
        model: ModelIndex.Bar,
        as: 'bar'
      },{
        model: ModelIndex.Brewery,
        as: 'brewery'
    }]
  };
  const where = {};

  if(bar_id !== undefined){where.bar_id = bar_id};
  if(brewery_id !== undefined){where.brewery_id = brewery_id};
  options.where = where;

  return Event.findAll(options);
};


//////////////////////////////////////////////////////
EventController.getOne = function(event_id){
  const options = {
    include: [{
        model: ModelIndex.Bar,
        as: 'bar'
      },{
        model: ModelIndex.Brewery,
        as: 'brewery'
    }]
  };
  const where = {};

  if(event_id !== undefined){where.id = event_id};
  options.where = where;

  return Event.find(options);
}

////////////////////////////////////////////////////
EventController.research = function(data){
  const options = {
    include: [{
        model: ModelIndex.Bar,
        as: 'bar'
      },{
        model: ModelIndex.Brewery,
        as: 'brewery'
    }]
  };
  const where = {};
  where.title = { like: '%' + data + '%' }
  options.where = where;

  return Event.findAll(options);
};


//////////////////////////////////////////////////////
EventController.update = function(event, title, startDate, endDate, description){
  const options = {};
  const where = {};
  const json = {};

  if(title !== undefined){json.title = title}
  if(startDate !== undefined){json.startDate = startDate}
  if(endDate !== undefined){json.endDate = endDate}
  if(description !== undefined){json.description = description}
  options.where = where;
  options.timezone = '+02:00';

  return event.updateAttributes(json);
};

//////////////////////////////////////////////////////
EventController.delete = function(event){
  event.destroy();
};


module.exports = EventController;
