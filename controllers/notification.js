const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const Notification = ModelIndex.Notification;
const NotificationController = function(){};


////////////////////////////////////////////////////
NotificationController.add = function(texte, type, user_id, other_user_id, group_id){
  console.log("0.5");
  return Notification.create({
    texte: texte,
    type: type,
    user_id: user_id,
    other_user_id: other_user_id,
    group_id: group_id
  });
};


////////////////////////////////////////////////////
NotificationController.getAll = function(user_id, other_user_id, group_id, statut){
  const options = {
    include: [
      {
        model: ModelIndex.User,
        as: 'user'
      },
      {
        model: ModelIndex.User,
        as: 'other_user'
      },
      {
        model: ModelIndex.Group,
        as: 'group'
      },
    ]
  };
  const where = {};

  if(user_id !== undefined){where.user_id = user_id};
  if(other_user_id !== undefined){where.other_user_id = other_user_id};
  if(group_id !== undefined){where.group_id = group_id};
  if(statut !== undefined){where.statut = statut};
  options.where = where;

  console.log(options);

  return Notification.findAll(options);
};


//////////////////////////////////////////////////////
NotificationController.getOne = function(notification_id){
  const options = {
    include: [
      {
        model: ModelIndex.User,
        as: 'user'
      },
      {
        model: ModelIndex.User,
        as: 'other_user'
      },
      {
        model: ModelIndex.Group,
        as: 'group'
      },
    ]
  };
  const where = {};

  if(notification_id !== undefined){where.id = notification_id};
  options.where = where;

  return Notification.find(options);
}


//////////////////////////////////////////////////////
NotificationController.update = function(notification, texte, type, statut, user_id, other_user_id, group_id){
  const options = {};
  const where = {};
  const json = {};

  if(texte !== undefined){json.texte = texte};
  if(type !== undefined){json.type = type};
  if(statut !== undefined){json.statut = statut};
  if(user_id !== undefined){json.user_id = user_id};
  if(other_user_id !== undefined){json.other_user_id = other_user_id};
  if(group_id !== undefined){json.group_id = group_id};

  options.where = where;
  options.timezone = '+02:00';

  return notification.updateAttributes(json);
};


//////////////////////////////////////////////////////
NotificationController.delete = function(notification){
  notification.destroy();
};


module.exports = NotificationController;
