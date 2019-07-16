const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const CommentsBrewery = ModelIndex.CommentsBrewery;
const CommentsBreweryController = function(){};


////////////////////////////////////////////////////
CommentsBreweryController.add = function(text, user_id, brewery_id){
  return CommentsBrewery.create({
    text: text,
    user_id: user_id,
    brewery_id: brewery_id
  });
};


////////////////////////////////////////////////////
CommentsBreweryController.getAll = function(user_id = undefined, brewery_id = undefined){
  const options = {};
  const where = {};

  if(user_id !== undefined){where.user_id = user_id};
  if(brewery_id !== undefined){where.brewery_id = brewery_id};
  options.where = where;

  return CommentsBrewery.findAll(options);
};


//////////////////////////////////////////////////////
CommentsBreweryController.getOne = function(commentsBrewery_id){
  const options = {};
  const where = {};

  if(commentsBrewery_id !== undefined){where.id = commentsBrewery_id};
  options.where = where;

  return CommentsBrewery.find(options);
}


//////////////////////////////////////////////////////
CommentsBreweryController.update = function(commentsBrewery, text){
  const options = {};
  const where = {};
  const json = {};

  if(text !== undefined){json.text = text}
  options.where = where;
  options.timezone = '+02:00';

  return commentsBrewery.updateAttributes(json);
};


//////////////////////////////////////////////////////
CommentsBreweryController.delete = function(commentsBrewery){
  commentsBrewery.destroy();
};


module.exports = CommentsBreweryController;
