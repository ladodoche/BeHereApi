const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const CommentsGroup = ModelIndex.CommentsGroup;
const CommentsGroupController = function(){};


////////////////////////////////////////////////////
CommentsGroupController.add = function(text, user_id, group_id){
  return CommentsGroup.create({
    text: text,
    user_id: user_id,
    group_comment_id: group_id
  });
};


////////////////////////////////////////////////////
CommentsGroupController.getAll = function(user_id = undefined, group_id = undefined){
  const options = {};
  const where = {};

  if(user_id !== undefined){where.user_id = user_id};
  if(group_id !== undefined){where.group_comment_id = group_id};
  options.where = where;

  return CommentsGroup.findAll(options);
};


//////////////////////////////////////////////////////
CommentsGroupController.getOne = function(commentsGroup_id){
  const options = {};
  const where = {};

  if(commentsGroup_id !== undefined){where.id = commentsGroup_id};
  options.where = where;

  return CommentsGroup.find(options);
}


//////////////////////////////////////////////////////
CommentsGroupController.update = function(commentsGroup, text){
  const options = {};
  const where = {};
  const json = {};

  if(text !== undefined){json.text = text}
  options.where = where;
  options.timezone = '+02:00';

  return commentsGroup.updateAttributes(json);
};


//////////////////////////////////////////////////////
CommentsGroupController.delete = function(commentsGroup){
  commentsGroup.destroy();
};


module.exports = CommentsGroupController;
