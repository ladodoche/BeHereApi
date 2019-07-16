const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const NotesBeer = ModelIndex.NotesBeer;
const NotesBeerController = function(){};


////////////////////////////////////////////////////
NotesBeerController.add = function(note, user_id, beer_id){
  return NotesBeer.create({
    note: note,
    user_id: user_id,
    beer_id: beer_id
  });
};


////////////////////////////////////////////////////
NotesBeerController.getAll = function(user_id = undefined, beer_id = undefined){
  const options = {};
  const where = {};

  if(user_id !== undefined){where.user_id = user_id};
  if(beer_id !== undefined){where.beer_id = beer_id};
  options.where = where;

  return NotesBeer.findAll(options);
};


//////////////////////////////////////////////////////
NotesBeerController.getOne = function(notesBeer_id){
  const options = {};
  const where = {};

  if(notesBeer_id !== undefined){where.id = notesBeer_id};
  options.where = where;

  return NotesBeer.find(options);
}


//////////////////////////////////////////////////////
NotesBeerController.update = function(notesBeer, note){
  const options = {};
  const where = {};
  const json = {};

  if(note !== undefined){json.note = note}
  options.where = where;
  options.timezone = '+02:00';

  return notesBeer.updateAttributes(json);
};


//////////////////////////////////////////////////////
NotesBeerController.delete = function(notesBeer){
  notesBeer.destroy();
};


module.exports = NotesBeerController;
