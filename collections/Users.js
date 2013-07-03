if (Meteor.is_client) {

  Meteor.autorun(function () {
    Meteor.subscribe("users");
  });
}

if (Meteor.is_server) {

  Meteor.users.allow({
    insert: function (userId, user) {
      return Meteor.user().admin;
    },
    update: function (userId, user) {
      var currentUser = Meteor.users.findOne({_id: Meteor.userId()});
      return currentUser.admin;
    }
  });

  Meteor.publish("users", function () {
    var user = Meteor.users.findOne({_id: this.userId});

    if (user) {
      if (user.admin) {
        return Meteor.users.find();
      }
    }

    return Meteor.users.find({
          $or: [
            {_id: this.userId},
            {speaker: true}
          ]
        },
        { fields: {
          _id: 1,
          id: 1,
          speaker: true,
          twitter: 1,
          firstName: 1,
          lastName: 1,
          bio: 1,
          admin: 1
        }});
  });
}


