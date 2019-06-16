const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const Bar = ModelIndex.Bar;

const BarController = function(){};


////////////////////////////////////////////////////
BarController.add = function(name, gpsLatitude, gpsLongitude, description, webSiteLink, facebokLink, twitterLink, instagramLink, user_id){
  return Bar.create({
    name: name,
    gpsLatitude: gpsLatitude,
    gpsLongitude: gpsLongitude,
    description: description,
    webSiteLink: webSiteLink,
    facebokLink: facebokLink,
    twitterLink: twitterLink,
    instagramLink: instagramLink,
    user_id: user_id
  });
};

////////////////////////////////////////////////////
BarController.getAll = function(name, user_id){
  const options = {
    include: [{
      model: ModelIndex.User,
      as: 'user'
    }]
  };
  const where = {};

  if(name !== undefined){where.name = name};
  if(user_id !== undefined){where.user_id = user_id};
  options.where = where;
  return Bar.findAll(options);
};


//////////////////////////////////////////////////////
BarController.getOne = function(bar_id){
  const options = {};
  const where = {};

  if(bar_id !== undefined){where.id = bar_id};
  options.where = where;

  return Bar.find(options);
}


////////////////////////////////////////////////////
BarController.research = function(data){
  const options = {};
  const where = {};
  where.name = { like: '%' + data + '%' }
  options.where = where;

  return Bar.findAll(options);
};


//////////////////////////////////////////////////////
BarController.update = function(bar, name, gpsLatitude, gpsLongitude, description, webSiteLink, facebokLink, twitterLink, instagramLink, pathPicture){
  const options = {};
  const where = {};
  const json = {};

  if(name !== undefined){json.name = name}
  if(gpsLatitude !== undefined){json.gpsLatitude = gpsLatitude}
  if(gpsLongitude !== undefined){json.gpsLongitude = gpsLongitude}
  if(description !== undefined){json.description = description}
  if(webSiteLink !== undefined){json.webSiteLink = webSiteLink}
  if(facebokLink !== undefined){json.facebokLink = facebokLink}
  if(twitterLink !== undefined){json.twitterLink = twitterLink}
  if(instagramLink !== undefined){json.instagramLink = instagramLink}
  if(pathPicture !== undefined){json.pathPicture = pathPicture}
  options.where = where;
  options.timezone = '+02:00';

  return bar.updateAttributes(json);
};

//////////////////////////////////////////////////////
BarController.delete = function(bar){
  bar.destroy();
};


module.exports = BarController;
