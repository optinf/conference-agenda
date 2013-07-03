/***************************************************** Session */
Template.session.rendered = function () {

  $("#session_" + Session.get('currentSessionId')).addClass('active');

  var inlineContainers = ['description', 'location'];
  TemplateUtils.activateInlineEditing(inlineContainers);

  if (document.getElementById('attachment')) {
    filepicker.constructWidget(document.getElementById('attachment'));
  }

  //INFO-REQUIRED Add the default text that appear when you share via Twitter.
  addthis_share = {
    passthrough: {
      twitter: {
        text: "#Default Text"
      }
    }
  };

  var addthis_config = {"data_track_addressbar": true}; //addthis buttons

  addthis.toolbox("#toolbox");
};

Template.session.session = function () {

  var session_id = Session.get('currentSessionId');

  if (!session_id) {
    return {};
  }

  return Sessions.findOne({_id: session_id});
};


Template.session.isSessionSpeakerOrAdmin = function (sessionId) {
  return TemplateUtils.isSessionSpeakerOrAdmin(sessionId);
};

Template.session.isSubcribbed = function (session_id) {
  return Sessions.find({_id: session_id, subscriptions: {userId: Meteor.userId()} }).count() != 0;
};

Template.session.isSubcribbedToSameHourSession = function (session_id) {
  var session = Sessions.findOne({_id: session_id});
  if (!session) {
    return false;
  }

  return Sessions.find({subscriptions: {userId: Meteor.userId()}, _id: {$not: session_id}, "date.start": session.date.start}).count() != 0;
};


Template.session.events = {
  'click .subscribe': function (event) {

    var session_id = $(event.currentTarget).prev().val();

    var alreadySubsribed = Sessions.find({_id: session_id, subscriptions: {userId: Meteor.userId }}).count() != 0;

    var session = Sessions.findOne({_id: session_id});

    var alreadySubscribedToSameHour = Sessions.find({subscriptions: Meteor.userId(), _id: {$not: session_id}, "date.start": session.date.start}).count() != 0;

    if (!alreadySubscribedToSameHour && !alreadySubsribed) {
      Sessions.update({_id: session_id}, {$push: { subscriptions: {userId: Meteor.userId() }}});
    }
  },

  'click .unsubscribe': function (event) {
    var session_id = $(event.currentTarget).prev().val();

    Sessions.update({_id: session_id}, {$pull: { subscriptions: {userId: Meteor.userId()}}});

  },
  'blur #description': function (event) {

    var session_id = Session.get('currentSessionId');
    Sessions.update({_id: session_id }, {$set: {description: CKEDITOR.instances.description.getData()}});
  },
  'blur #location': function (event) {

    var session_id = Session.get('currentSessionId');
    Sessions.update({_id: session_id }, {$set: {location: CKEDITOR.instances.location.getData()}});
  },
  'change #attachment': function (evt) {
    var session_id = Session.get('currentSessionId');

    for (var i = 0; i < evt.fpfiles.length; i++) {
      Sessions.update({_id: session_id }, {$push: {files: {fpfile: evt.fpfiles[i]}}});
    }
  },
  'click .remove-file': function (e) {
    var session_id = Session.get('currentSessionId');

    var docURL = $(e.currentTarget).attr('rel');
    var session = Sessions.findOne({_id: session_id }, {files: {fpfile: {$elemMatch: {url: docURL}}}});

    for (var i = 0; i < session.files.length; i++) {
      if (session.files[i].fpfile.url == docURL) {
        filepicker.remove(session.files[i].fpfile);
      }
    }

    Sessions.update({_id: session_id }, {$pull: {files: { 'fpfile.url': docURL}}});
  }
};


