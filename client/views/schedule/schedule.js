
Template.schedule.sessions = function () {
  return Sessions.find({}, {sort: {sequence: 1}});
};

Template.schedule.isSubcribbed = function (session_id) {
  return Sessions.find({_id: session_id, subscriptions: {userId: Meteor.userId() }}).count() != 0;
};

Template.schedule.page = function () {
  return Meteor.Router.page();
};

Template.schedule.rendered = function () {

  //Remove duplicate headers. If you find a better way, tell me
  $('.nav-header').each(function () {
    var navHeaders = $('.nav-tabs').children('#' + this.id);

    if (navHeaders.length > 1) {
      $(navHeaders[(navHeaders.length - 1)]).remove();
    }
  });
};

Template.schedule.events = {
  'click .enabled a': function (event) {
    $('html,body').scrollTop(0);
  }
};
