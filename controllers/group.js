const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const Group = ModelIndex.Group;
const GroupController = function(){};


////////////////////////////////////////////////////
GroupController.add = function(name, admin_id){
  return Group.create({
    name: name,
    admin_id: admin_id
  });
};


//////////////////////////////////////////////////////
GroupController.addUser = function(group, user){
  return group.addUser(user);
};


////////////////////////////////////////////////////
GroupController.getAll = function(name, admin_id, user_id){
  var options;
  if(user_id !== undefined){
    console.log("1");
    options = {
      include: [{
        model: ModelIndex.User,
        as: 'user',
        where: { id: user_id }
      }]
    };
  }else{
    console.log("2");
    options = {
      include: [{
        model: ModelIndex.User,
        as: 'user'
      }]
    };
  }
  const where = {};

  if(name !== undefined){where.name = name};
  if(admin_id !== undefined){where.admin_id = admin_id};
  options.where = where;

  return Group.findAll(options);
};


////////////////////////////////////////////////////
GroupController.research = function(data){
  const options = {};
  const where = {};
  where.name = { like: '%' + data + '%' }
  options.where = where;

  return Group.findAll(options);
};


//////////////////////////////////////////////////////
GroupController.getOne = function(group_id){
  const options = {
    include: [{
      model: ModelIndex.User,
      as: 'user'
    }]
  };
  const where = {};

  if(group_id !== undefined){where.id = group_id};
  options.where = where;

  return Group.find(options);
}


//////////////////////////////////////////////////////
GroupController.update = function(group, name, pathPicture){
  const options = {};
  const where = {};
  const json = {};

  if(name !== undefined){json.name = name}
  if(pathPicture !== undefined){json.pathPicture = pathPicture}
  options.where = where;
  options.timezone = '+02:00';

  return group.updateAttributes(json);
};


//////////////////////////////////////////////////////
GroupController.delete = function(group){
  group.destroy();
};


//////////////////////////////////////////////////////
GroupController.deleteUser = function(group, user){
  group.removeUser(user);
};


module.exports = GroupController;
