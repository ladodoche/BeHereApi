const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const NotesBar = ModelIndex.NotesBar;
const NotesBarController = function(){};


////////////////////////////////////////////////////
NotesBarController.add = function(note, user_id, bar_id){
  return NotesBar.create({
    note: note,
    user_id: user_id,
    bar_id: bar_id
  });
};


////////////////////////////////////////////////////
NotesBarController.getAll = function(user_id = undefined, bar_id = undefined){
  const options = {};
  const where = {};

  if(user_id !== undefined){where.user_id = user_id};
  if(bar_id !== undefined){where.bar_id = bar_id};
  options.where = where;

  return NotesBar.findAll(options);
};


//////////////////////////////////////////////////////
NotesBarController.getOne = function(notesBar_id){
  const options = {};
  const where = {};

  if(notesBar_id !== undefined){where.id = notesBar_id};
  options.where = where;

  return NotesBar.find(options);
}


//////////////////////////////////////////////////////
NotesBarController.update = function(notesBar, note){
  const options = {};
  const where = {};
  const json = {};

  if(note !== undefined){json.note = note}
  options.where = where;
  options.timezone = '+02:00';

  return notesBar.updateAttributes(json);
};


//////////////////////////////////////////////////////
NotesBarController.delete = function(notesBar){
  notesBar.destroy();
};


module.exports = NotesBarController;
