Handlebars.registerHelper('subString', function (passedString) {
  var theString = passedString.substring(0, 50);
  return new Handlebars.SafeString(theString)
});

Handlebars.registerHelper('getTime', function (dateString) {
  var date = new Date(dateString);

  if (date.getTime()) {
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return date.getHours() + 'h' + minutes;
  }
});

Handlebars.registerHelper('formatDate', function (dateString) {
  var date = new Date(dateString);

  if (date.getMonth()) {
    return date.getDate() + '/' +  (date.getMonth()+1) + '/' + date.getFullYear();
  }
});

Handlebars.registerHelper('arraySize', function (array) {
  return array.length;
});

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (needle) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === needle) {
        return i;
      }
    }
    return -1;
  };
}

/**
 * Multi template utils
 *
 * Meteor uses file scoping.
 *
 */

TemplateUtils = {

  activateInlineEditing: function (containers) {

    var currentUser = Meteor.users.findOne({_id: Meteor.userId()});

    if (currentUser && currentUser.admin) {
      CKEDITOR.disableAutoInline = true;
      for (var i = 0; i < containers.length; i++) {
        $('#' + containers[i]).attr('contenteditable', 'true');
        CKEDITOR.inline(containers[i]);
      }
    }

  },
  isSessionSpeakerOrAdmin: function (sessionId) {
//  Script kiddies can try "return true;" here but it won't do much.
    var session = Sessions.findOne({_id: sessionId});

    if (!session) {
      return false;
    }

    var userCaller = Meteor.users.findOne({_id: Meteor.userId()});

    if (!userCaller) {
      return false
    }
    if (userCaller.admin) {
      return true;
    }

    var sessionSpeaker = Meteor.users.findOne({id: session.speaker});

    if (!sessionSpeaker) {
      return false;
    }
    return Meteor.userId() === sessionSpeaker._id;
  }
};
