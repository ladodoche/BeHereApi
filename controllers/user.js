const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const User = ModelIndex.User;

const UserController = function(){};


////////////////////////////////////////////////////
UserController.add = function(email, password, name, surname, birthDate, id_phone){
  return User.create({
    email: email,
    password: password,
    name: name,
    surname: surname,
    birthDate: birthDate,
    id_phone: id_phone
  });
};


//////////////////////////////////////////////////////
UserController.addTypeOfBeer = function(user, typeOfBeer){
  return user.addTypeOfBeer(typeOfBeer);
};


//////////////////////////////////////////////////////
UserController.addBar = function(user, bar){
  return user.addBar(bar);
};


//////////////////////////////////////////////////////
UserController.addBrewery = function(user, brewery){
  return user.addBrewery(brewery);
};


////////////////////////////////////////////////////
UserController.login = function(email, password){
  const options = {};
  const where = {};

  if(email !== undefined){where.email = email};
  if(password !== undefined){where.password = password};
  options.where = where;

  return User.findOne(options);
};


////////////////////////////////////////////////////
UserController.getAll = function(email = undefined){
  const options = {
    include: [{
      model: ModelIndex.TypeOfBeer,
      as: 'typeOfBeer'
    },{
      model: ModelIndex.Bar,
      as: 'bar'
    },{
      model: ModelIndex.Brewery,
      as: 'brewery'
    }]
  };
  const where = {};

  if(email !== undefined){where.email = email};
  options.where = where;

  return User.findAll(options);
};


//////////////////////////////////////////////////////
UserController.getOne = function(user_id){
  const options = {
    include: [{
      model: ModelIndex.TypeOfBeer,
      as: 'typeOfBeer'
    },{
      model: ModelIndex.Bar,
      as: 'bar'
    },{
      model: ModelIndex.Brewery,
      as: 'brewery'
    }]
  };
  const where = {};

  if(user_id !== undefined){where.id = user_id};
  options.where = where;

  return User.find(options);
}


////////////////////////////////////////////////////
UserController.researchSubscriptionBar = function(data){
  const options = {
    include: [{
      model: ModelIndex.Bar,
      as: 'bar',
      where: {
        id: data
     }
    }]
  };
  const where = {};
  options.where = where;

  return User.findAll(options);
};


////////////////////////////////////////////////////
UserController.researchSubscriptionBrewery = function(data){
  const options = {
    include: [{
      model: ModelIndex.Brewery,
      as: 'bar',
      where: {
        id: data
     }
    }]
  };
  const where = {};
  options.where = where;

  return User.findAll(options);
};


////////////////////////////////////////////////////
UserController.research = function(data){
  const datas = data.split(' ');
  const options = {};
  const where = {};
  var or = {};
  for (var i = 0; i < datas.length; i++){
    or.name = { like: ["%" + datas[i] + "%"] } ;
    or.surname = { like: ["%" + datas[i] + "%"] } ;
  }
  where.or = or;
  options.where = where;

  return User.findAll(options);
};


//////////////////////////////////////////////////////
UserController.update = function(user, email, name, surname, birthDate, pathPicture, password = undefined){
  const options = {};
  const where = {};
  const json = {};

  if(email !== undefined){json.email = email}
  if(name !== undefined){json.name = name}
  if(surname !== undefined){json.surname = surname}
  if(birthDate !== undefined){json.birthDate = birthDate}
  if(pathPicture !== undefined){json.pathPicture = pathPicture}
  if(password !== undefined){json.password = password}
  options.where = where;
  options.timezone = '+02:00';

  return user.updateAttributes(json);
};


//////////////////////////////////////////////////////
UserController.delete = function(user){
  user.destroy();
};


//////////////////////////////////////////////////////
UserController.deleteTypeOfBeer = function(user, typeOfBeer){
  user.removeTypeOfBeer(typeOfBeer);
};


//////////////////////////////////////////////////////
UserController.deleteBar = function(user, bar){
  user.removeBar(bar);
};


//////////////////////////////////////////////////////
UserController.deleteBrewery = function(user, brewery){
  user.removeBrewery(brewery);
};


module.exports = UserController;
