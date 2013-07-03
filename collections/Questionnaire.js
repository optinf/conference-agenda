Questionnaire = new Meteor.Collection("questionnaire");

if (Meteor.is_client) {
  Meteor.autorun(function () {
    Meteor.subscribe("questionnaire");
  });
}

if (Meteor.is_server) {

  Questionnaire.allow({
    insert: function (userId, user) {
      return Meteor.user().speaker || Meteor.user().admin;
    },
    update: function (userId) {
      return Meteor.user().speaker || Meteor.user().admin;
    },
    remove: function (userId) {
      return Meteor.user().speaker || Meteor.user().admin;
    }
  });

  Meteor.publish("questionnaire", function () {
    return Questionnaire.find();
  });
}


