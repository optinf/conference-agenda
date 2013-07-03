Sessions = new Meteor.Collection("sessions");

if (Meteor.is_client) {
  Meteor.autorun(function () {
    Meteor.subscribe("Sessions");
  });
}

if (Meteor.is_server) {
  Meteor.publish("Sessions", function () {
    return Sessions.find({});
  });


  Sessions.allow({
    insert: function (userId) {
      var currentUser = Meteor.users.findOne({_id: userId});
      if (currentUser.admin) {
        return true;
      }
    },
    update: function (userId, doc, fieldNames, modifier) {

      var currentUser = Meteor.users.findOne({_id: userId});
      var modifierSubscriptionId = null;

      if (currentUser.admin) {
        return true;
      }

      //The user wants to subscribe
      if (fieldNames.toString() === 'subscriptions') {
        if (modifier.$pull) {
          modifierSubscriptionId = modifier.$pull.subscriptions.userId;
        }
        else if (modifier.$push) {
          modifierSubscriptionId = modifier.$push.subscriptions.userId;
        }
        if (modifierSubscriptionId === userId) {
          return true;
        }
      }

      //All users can send a survey
      if (fieldNames.toString() === 'surveys') {
        return modifier.$push.surveys.user_id === userId;
      }


      //Only speaker of session can upload file
      if (fieldNames.toString() === 'files') {
        return doc.speaker == currentUser.id;

      }

      return false;
    },
    //Only speaker of session can delete file
    remove: function (userId, docs) {

      var currentUser = Meteor.users.findOne({_id: userId });

      if (currentUser.admin) {
        return true;
      }

      return docs.speaker === currentUser.id;
    }
  });
}


