const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const CommentsUser = ModelIndex.CommentsUser;
const CommentsUserController = function(){};


////////////////////////////////////////////////////
CommentsUserController.add = function(text, user_id, user_comment_id){
  return CommentsUser.create({
    text: text,
    user_id: user_id,
    user_comment_id: user_comment_id
  });
};


////////////////////////////////////////////////////
CommentsUserController.getAll = function(user_id = undefined, user_comment_id = undefined){
  const options = {};
  const where = {};

  if(user_id !== undefined){where.user_id = user_id};
  if(user_comment_id !== undefined){where.user_comment_id = user_comment_id};
  options.where = where;

  return CommentsUser.findAll(options);
};


//////////////////////////////////////////////////////
CommentsUserController.getOne = function(commentsUser_id){
  const options = {};
  const where = {};

  if(commentsUser_id !== undefined){where.id = commentsUser_id};
  options.where = where;

  return CommentsUser.find(options);
}


//////////////////////////////////////////////////////
CommentsUserController.update = function(commentsUser, text){
  const options = {};
  const where = {};
  const json = {};

  if(text !== undefined){json.text = text}
  options.where = where;
  options.timezone = '+02:00';

  return commentsUser.updateAttributes(json);
};


//////////////////////////////////////////////////////
CommentsUserController.delete = function(commentsUser){
  commentsUser.destroy();
};


module.exports = CommentsUserController;
