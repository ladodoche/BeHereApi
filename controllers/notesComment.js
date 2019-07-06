const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const NotesComment = ModelIndex.NotesComment;
const NotesCommentController = function(){};


////////////////////////////////////////////////////
NotesCommentController.add = function(note, user_id, commentsBar_id, commentsBeer_id, commentsBrewery_id, commentsUser_id){
  return NotesComment.create({
    note: note,
    user_id: user_id,
    comments_bar_id: commentsBar_id,
    comments_beer_id: commentsBeer_id,
    comments_brewery_id: commentsBrewery_id,
    comments_user_id: commentsUser_id
  });
};


////////////////////////////////////////////////////
NotesCommentController.getAll = function(user_id = undefined, commentsBar_id = undefined, commentsBeer_id = undefined, commentsBrewery_id = undefined, commentsUser_id = undefined){
  const options = {};
  const where = {};

  if(user_id !== undefined){where.user_id = user_id};
  if(commentsBar_id !== undefined){where.comments_bar_id = commentsBar_id};
  if(commentsBeer_id !== undefined){where.comments_beer_id = commentsBeer_id};
  if(commentsBrewery_id !== undefined){where.comments_brewery_id = commentsBrewery_id};
  if(commentsUser_id !== undefined){where.comments_user_id = commentsUser_id};
  options.where = where;

  return NotesComment.findAll(options);
};


//////////////////////////////////////////////////////
NotesCommentController.getOne = function(commentsBar_id){
  const options = {};
  const where = {};

  if(commentsBar_id !== undefined){where.id = commentsBar_id};
  options.where = where;

  return NotesComment.find(options);
}


//////////////////////////////////////////////////////
NotesCommentController.update = function(notesComment, note){
  const options = {};
  const where = {};
  const json = {};

  if(note !== undefined){json.note = note}
  options.where = where;
  options.timezone = '+02:00';

  return notesComment.updateAttributes(json);
};


//////////////////////////////////////////////////////
NotesCommentController.delete = function(notesComment){
  notesComment.destroy();
};


module.exports = NotesCommentController;
