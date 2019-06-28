const ModelIndex  = require('../models');
const Op = ModelIndex.Op;
const Friend = ModelIndex.Friend;
const FriendController = function(){};


////////////////////////////////////////////////////
FriendController.add = function(user_id, user_friend_id){
  return Friend.create({
    user_id: user_id,
    user_friend_id: user_friend_id
  });
};


////////////////////////////////////////////////////
FriendController.getAll = function(user_id, user_friend_id, status, id){
  const options = {};
  const where = {};

  if(id !== undefined){
    var or = {};
    or.user_id = id;
    or.user_friend_id = id;
    where.or = or;
  };
  if(user_id !== undefined){where.user_id = user_id};
  if(user_friend_id !== undefined){where.user_friend_id = user_friend_id};
  if(status !== undefined){where.status = status};
  options.where = where;

  return Friend.findAll(options);
};


//////////////////////////////////////////////////////
FriendController.getOne = function(friend_id){
  const options = {};
  const where = {};

  if(friend_id !== undefined){where.id = friend_id};
  options.where = where;

  return Friend.find(options);
}


//////////////////////////////////////////////////////
FriendController.update = function(friend, status){
  const options = {};
  const where = {};
  const json = {};

  if(status !== undefined){json.status = status}
  options.where = where;
  options.timezone = '+02:00';

  return friend.updateAttributes(json);
};


//////////////////////////////////////////////////////
FriendController.delete = function(friend){
  friend.destroy();
};


module.exports = FriendController;
