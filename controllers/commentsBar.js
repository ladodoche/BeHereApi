const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const CommentsBar = ModelIndex.CommentsBar;
const CommentsBarController = function(){};


////////////////////////////////////////////////////
CommentsBarController.add = function(text, user_id, bar_id){
  return CommentsBar.create({
    text: text,
    user_id: user_id,
    bar_id: bar_id
  });
};


////////////////////////////////////////////////////
CommentsBarController.getAll = function(user_id = undefined, bar_id = undefined){
  const options = {};
  const where = {};

  if(user_id !== undefined){where.user_id = user_id};
  if(bar_id !== undefined){where.bar_id = user_id};
  options.where = where;

  return CommentsBar.findAll(options);
};


//////////////////////////////////////////////////////
CommentsBarController.getOne = function(commentsBar_id){
  const options = {};
  const where = {};

  if(commentsBar_id !== undefined){where.id = commentsBar_id};
  options.where = where;

  return CommentsBar.find(options);
}


//////////////////////////////////////////////////////
CommentsBarController.update = function(commentsBar, text){
  const options = {};
  const where = {};
  const json = {};

  if(text !== undefined){json.text = text}
  options.where = where;
  options.timezone = '+02:00';

  return commentsBar.updateAttributes(json);
};


//////////////////////////////////////////////////////
CommentsBarController.delete = function(commentsBar){
  commentsBar.destroy();
};


module.exports = CommentsBarController;
