const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const Message = ModelIndex.Message;
const MessageController = function(){};


////////////////////////////////////////////////////
MessageController.add = function(user_sender_id, text, user_receiver_id, group_id){
  return Message.create({
    user_sender_id: user_sender_id,
    text: text,
    user_receiver_id: user_receiver_id,
    group_id: group_id
  });
};


////////////////////////////////////////////////////
MessageController.getAll = function(user_sender_id, user_receiver_id, group_id){
  const options = {
    include: [
      {
        model: ModelIndex.User,
        as: 'user_sender'
      },
      {
        model: ModelIndex.User,
        as: 'user_receiver'
      },
      {
        model: ModelIndex.Group,
        as: 'group'
      },
    ]
  };
  const where = {};

  if(user_sender_id !== undefined){where.user_sender_id = user_sender_id};
  if(user_receiver_id !== undefined){where.user_receiver_id = user_receiver_id};
  if(group_id !== undefined){where.group_id = group_id};
  options.where = where;

  return Message.findAll(options);
};


//////////////////////////////////////////////////////
MessageController.getOne = function(message_id){
  const options = {
    include: [
      {
        model: ModelIndex.User,
        as: 'user_sender'
      },
      {
        model: ModelIndex.User,
        as: 'user_receiver'
      },
      {
        model: ModelIndex.Group,
        as: 'group'
      },
    ]
  };
  const where = {};

  if(message_id !== undefined){where.id = message_id};
  options.where = where;

  return Message.find(options);
}


//////////////////////////////////////////////////////
MessageController.update = function(message, name){
  const options = {};
  const where = {};
  const json = {};

  if(user_sender_id !== undefined){json.user_sender_id = user_sender_id};
  if(user_receiver_id !== undefined){json.user_receiver_id = user_receiver_id};
  if(group_id !== undefined){json.group_id = group_id};

  options.where = where;
  options.timezone = '+02:00';

  return message.updateAttributes(json);
};


//////////////////////////////////////////////////////
MessageController.delete = function(message){
  message.destroy();
};


module.exports = MessageController;
