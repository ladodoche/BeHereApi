const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const Brewery = ModelIndex.Brewery;
const Beer = ModelIndex.Beer;

const BreweryController = function(){};


////////////////////////////////////////////////////
BreweryController.add = function(name, gpsLatitude, gpsLongitude, description, webSiteLink, facebokLink, twitterLink, instagramLink, user_id){
  return Brewery.create({
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
BreweryController.getAll = function(name, user_id, type_of_beer_id){
  var optionsBrewery = {};
  var optionsBeer = {};
  var result = {};
  const where = {};

  if(type_of_beer_id !== undefined){

    var or = [];
    optionsBeer = {
      include: [{
        model: ModelIndex.TypeOfBeer,
        as: 'typeOfBeer',
        where: { id: type_of_beer_id }
      }]
    };

    return Beer.findAll(optionsBeer).then((beers) => {

      for(var i = 0; i < beers.length; i++)
        or.push(beers[i].brewery_id);

      where.id = or;
      optionsBrewery.where = where;
      return Brewery.findAll(optionsBrewery);
    });
  }else{

    if(name !== undefined){where.name = name};
    if(user_id !== undefined){where.user_id = user_id};
    optionsBrewery.where = where;
    return Brewery.findAll(optionsBrewery);
  }
};


//////////////////////////////////////////////////////
BreweryController.getOne = function(brewery_id){
  const options = {};
  const where = {};

  if(brewery_id !== undefined){where.id = brewery_id};
  options.where = where;

  return Brewery.find(options);
}


////////////////////////////////////////////////////
BreweryController.research = function(data){
  const options = {};
  const where = {};
  where.name = { like: '%' + data + '%' }
  options.where = where;

  return Brewery.findAll(options);
};


//////////////////////////////////////////////////////
BreweryController.update = function(brewery, name, gpsLatitude, gpsLongitude, description, webSiteLink, facebokLink, twitterLink, instagramLink, pathPicture){
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

  return brewery.updateAttributes(json);
};

//////////////////////////////////////////////////////
BreweryController.delete = function(brewery){
  brewery.destroy();
};


module.exports = BreweryController;
