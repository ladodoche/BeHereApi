const NotificationController = function() { };
const FCM = require('fcm-push');
const serviceAccount = require("./fir-storage-sdk");

NotificationController.sendMessageUser = function (message, user) {
  console.log("sendMessageUser start");
  var serverkey = serviceAccount.serveur_key;
  console.log("serverkey");
  console.log(serverkey);
  var fcm = new FCM(serverkey);
  message = {
    "to" : user.id_phone,
    "notification" : {
      "title" :  user.name + " " + user.surname + " vous a envoyé un message",
      "body" : message.text,
      //"icon" : "../iconApp.svg",
      "click_action" : "messageUser"
    }
  };
  console.log("message");
  console.log(message);
  fcm.send(message, function(err,response){
    console.log("fcm.send start");
    console.log("response");
    console.log(response);
    if(err){
      console.log("error");
      console.log(err);
      return 0;
    }
    else{
      console.log("Success");
      return 1;
    }
    console.log("aaaa");
    return 0;
  });
};

NotificationController.sendMessageGroup = function (message, user, group) {
  var serverkey = serviceAccount.serveur_key;
  var fcm = new FCM(serverkey);
  message = {
    "to" : user.id_phone,
    "notification" : {
      "title" : "Vous avez reçu un message dans le groupe " + group.name,
      "body" : message.text,
      //"icon" : "../iconApp.svg",
      "click_action" : "messageGroup"
    }
  };
  fcm.send(message, function(err,response){
    if(err)
      return 0;
    else
      return 1;
    return 0;
  });
};

NotificationController.sendMessageEvent = function (entity, event, user) {
  console.log("start sendMessageEvent");
  var serverkey = serviceAccount.serveur_key;
  var fcm = new FCM(serverkey);
  message = {
    "to" : user.id_phone,
    "notification" : {
      "title" : entity.name + " à créé un évènenement",
      "body" : event.title,
      //"icon" : "../iconApp.svg",
      "click_action" : "messageEvent"
    }
  };
  fcm.send(message, function(err,response){
    if(err)
      return 0;
    else
      return 1;
    return 0;
  });
  console.log("end sendMessageEvent");
};

module.exports = NotificationController;
