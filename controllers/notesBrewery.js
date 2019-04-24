const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const NotesBrewery = ModelIndex.NotesBrewery;
const NotesBreweryController = function(){};


////////////////////////////////////////////////////
NotesBreweryController.add = function(note, user_id, brewery_id){
  return NotesBrewery.create({
    note: note,
    user_id: user_id,
    brewery_id: brewery_id
  });
};


////////////////////////////////////////////////////
NotesBreweryController.getAll = function(user_id = undefined, brewery_id = undefined){
  const options = {};
  const where = {};

  if(user_id !== undefined){where.user_id = user_id};
  if(brewery_id !== undefined){where.brewery_id = user_id};
  options.where = where;

  return NotesBrewery.findAll(options);
};


//////////////////////////////////////////////////////
NotesBreweryController.getOne = function(notesBrewery_id){
  const options = {};
  const where = {};

  if(notesBrewery_id !== undefined){where.id = notesBrewery_id};
  options.where = where;

  return NotesBrewery.find(options);
}


//////////////////////////////////////////////////////
NotesBreweryController.update = function(notesBrewery, note){
  const options = {};
  const where = {};
  const json = {};

  if(note !== undefined){json.note = note}
  options.where = where;
  options.timezone = '+02:00';

  return notesBrewery.updateAttributes(json);
};


//////////////////////////////////////////////////////
NotesBreweryController.delete = function(notesBrewery){
  notesBrewery.destroy();
};


module.exports = NotesBreweryController;
