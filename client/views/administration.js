Template.admin_inscriptions.sessions = function () {
  return Sessions.find({subscriptions: {$exists: true }, attendable: true}, {sort: {sequence: 1}});
};

Template.admin_users.users = function () {
  return Meteor.users.find({speaker: { $exists: false}}, {sort: {createdAt: 1}}).fetch();
};

Template.admin_speakers.events = {
  'click .session-link': function (event) {
    $('html,body').scrollTop(0);
  },
  'click .send-enrollment-email': function (event) {

    var id = $(event.currentTarget).parent().prev().find('.speaker-id').val();
    var email = $(event.currentTarget).parent().prev().find('.speaker-email').val();

    Meteor.users.update({_id: id}, {$unset: {emails: 1}});

    if (email === '' || id === '') {
      $('#error-modal').modal();
      return false;
    }

    Meteor.users.update({_id: id}, {$push: {emails: {address: email}}}, function (error) {

      if (!error) {
        Meteor.call('sendEnrollmentEmail', Meteor.userId(), id, function (error) {

          if (!error) {
            $('#success-modal').modal();
          }
          else {
            $('#error-modal').modal();
          }
        });
      }
      else {
        $('#error-modal').modal();
      }
    });
  }
};

Template.admin_speakers.speakers = function () {
  return Meteor.users.find({speaker: true});
};

Template.admin_surveys.sessions = function () {
  return Sessions.find({attendable: true});
};
Template.admin_surveys.surveyUserEmail = function (userId) {
  console.log(userId);

  var user = Meteor.users.findOne({_id: userId});

  if(!user) {
    return null
  }

  var surveyUserEmails = user.emails;

  if (surveyUserEmails.length > 0) {
    return surveyUserEmails[0].address;
  }
  else {
    return false;
  }
};
