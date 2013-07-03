
Template.speaker.speaker = function (sessionId) {

  var session = Sessions.findOne({_id: sessionId});

  if (!session) {
    return null;
  }
  return Meteor.users.findOne({id: session.speaker});
};

Template.speaker.rendered = function() {
  var containers = ['speaker'];
  TemplateUtils.activateInlineEditing(containers);
};

Template.speaker.events = {

  'blur #speaker': function (event) {

    var session_id = Session.get('currentSessionId');

    var session = Sessions.findOne({_id: session_id});

    if (!session) {
      return null;
    }

    var speaker = Meteor.users.findOne({id: session.speaker});
    Meteor.users.update({_id : speaker._id }, {$set: {bio: CKEDITOR.instances.speaker.getData()}});
  }
};
