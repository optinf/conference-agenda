var nowDate = new Date();
var dateDep = new Deps.Dependency;

var getDate = function () {
  dateDep.depend();
  return nowDate;
};

var setDate = function (w) {
  nowDate = w;
  dateDep.changed();
};

function findCurrentSession() {

  return Sessions.findOne({
        $or: [
          {subscriptions: {userId: Meteor.userId()}},
          {attendable: false}
        ],
        "date.start": {$lte: getDate()},
        "date.end": {$gt: getDate()}},
      {sort: {sequence: 1}}
  );
}

function findFutureSessions() {

  var futureSessions = Sessions.find({
        $or: [
          {subscriptions: {userId: Meteor.userId()}},
          {attendable: false}
        ],
        "date.start": {$gt: getDate()}
      },
      {sort: {sequence: 1}}
  );

  return futureSessions.count() == 0 ? null : futureSessions.fetch();
}

Template.agenda_previous.previousSessions = function () {

  var previousSessions = Sessions.find({
        subscriptions: {userId: Meteor.userId()},
        "date.end": {$lt: getDate() }
      },
      {sort: {sequence: 1}}
  );

  return previousSessions.count() == 0 ? null : previousSessions.fetch();
};


Template.agenda_current.currentSession = function () {

  var currentSession = findCurrentSession();
  if (currentSession) {
    return currentSession;
  }
};

Template.agenda_next.nextSession = function () {

  var futureSessions = findFutureSessions();

  if (futureSessions) {
    return futureSessions[0];
  }
};

Template.agenda_next.rendered = function () {

  var futureSessions = findFutureSessions();

  if (futureSessions) {

    var nextSessionDate = new Date(futureSessions[0].date.start);

    if (nextSessionDate < new Date()) {
      setDate(new Date());
    }

    $('#time-left').countdown({until: nextSessionDate, format: 'DDHMS', significant: 2, onExpiry: function () {

      //Add one second delay or else the nextSession is the same as the old one
      Meteor.setTimeout(function () {
        setDate(new Date());
      }, 1000);
    }});
  }

  $('#help').popover();
};

Template.agenda_next.futureSessions = function () {

  var futureSessions = findFutureSessions();
  return futureSessions === null ? null : futureSessions.slice(1);
};

Template.agenda_previous.rendered = function () {
  var id = Session.get("agenda_previous_active_toggle");
  $('#collapse' + id).addClass('in');
};

Template.agenda.users = function () {
  return Meteor.users.find();
};


Template.agenda.events = {
  'click .session-link': function (event) {
    $('html,body').scrollTop(0);
  }
};

Template.agenda_next.events = {
  'click .next-sessions .enabled a': function (event) {
    $('html,body').scrollTop(0);
  }
};

Template.agenda_previous.events = {
  'click #accordion2 .accordion-toggle': function (event) {

    var id = $(event.currentTarget).attr('id');
    var currentToggleId = Session.get('agenda_previous_active_toggle');

    if (currentToggleId === id) {
      Session.set('agenda_previous_active_toggle', undefined);
    }
    else {
      Session.set('agenda_previous_active_toggle', id);
    }
  }
};
