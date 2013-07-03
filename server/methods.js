Meteor.methods({
  sendEnrollmentEmail: function (userId, id) {

    var askingUser = Meteor.users.findOne({_id: userId});

    if (askingUser.admin) {
      Accounts.sendEnrollmentEmail(id);
    }
  }
});

