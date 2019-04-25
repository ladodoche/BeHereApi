const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const PicturesBar = ModelIndex.PicturesBar;
const PicturesBarController = function(){};


////////////////////////////////////////////////////
PicturesBarController.add = function(pathPicture, bar_id){
  return PicturesBar.create({
    pathPicture: pathPicture,
    bar_id: bar_id
  });
};


////////////////////////////////////////////////////
PicturesBarController.getAll = function(bar_id = undefined){
  const options = {};
  const where = {};

  if(bar_id !== undefined){where.bar_id = user_id};
  options.where = where;

  return PicturesBar.findAll(options);
};


//////////////////////////////////////////////////////
PicturesBarController.getOne = function(picturesBar_id){
  const options = {};
  const where = {};

  if(picturesBar_id !== undefined){where.id = picturesBar_id};
  options.where = where;

  return PicturesBar.find(options);
}


//////////////////////////////////////////////////////
PicturesBarController.update = function(picturesBar, pathPicture){
  const options = {};
  const where = {};
  const json = {};

  if(pathPicture !== undefined){json.pathPicture = pathPicture}
  options.where = where;
  options.timezone = '+02:00';

  return picturesBar.updateAttributes(json);
};


//////////////////////////////////////////////////////
PicturesBarController.delete = function(picturesBar){
  picturesBar.destroy();
};


module.exports = PicturesBarController;
