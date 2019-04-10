const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const User = ModelIndex.User;

const UserController = function(){};


////////////////////////////////////////////////////
UserController.add = function(email, password, name, surname, birthDate, pathPicture){
  return User.create({
    email: email,
    password: password,
    name: name,
    surname: surname,
    birthDate: birthDate
  });
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
  const options = {};
  const where = {};

  if(email !== undefined){where.email = email};
  options.where = where;

  return User.findAll(options);
};


//////////////////////////////////////////////////////
UserController.getOne = function(user_id){
  const options = {};
  const where = {};

  if(user_id !== undefined){where.id = user_id};
  options.where = where;

  return User.find(options);
}


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


module.exports = UserController;
