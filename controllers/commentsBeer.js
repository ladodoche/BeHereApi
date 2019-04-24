const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const CommentsBeer = ModelIndex.CommentsBeer;
const CommentsBeerController = function(){};


////////////////////////////////////////////////////
CommentsBeerController.add = function(text, user_id, beer_id){
  return CommentsBeer.create({
    text: text,
    user_id: user_id,
    beer_id: beer_id
  });
};


////////////////////////////////////////////////////
CommentsBeerController.getAll = function(user_id = undefined, beer_id = undefined){
  const options = {};
  const where = {};

  if(user_id !== undefined){where.user_id = email};
  if(beer_id !== undefined){where.beer_id = user_id};
  options.where = where;

  return CommentsBeer.findAll(options);
};


//////////////////////////////////////////////////////
CommentsBeerController.getOne = function(commentsBeer_id){
  const options = {};
  const where = {};

  if(commentsBeer_id !== undefined){where.id = commentsBeer_id};
  options.where = where;

  return CommentsBeer.find(options);
}


//////////////////////////////////////////////////////
CommentsBeerController.update = function(commentsBeer, text){
  const options = {};
  const where = {};
  const json = {};

  if(text !== undefined){json.text = text}
  options.where = where;
  options.timezone = '+02:00';

  return commentsBeer.updateAttributes(json);
};


//////////////////////////////////////////////////////
CommentsBeerController.delete = function(commentsBeer){
  commentsBeer.destroy();
};


module.exports = CommentsBeerController;
