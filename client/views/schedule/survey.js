Template.survey.surveyUserEmail = function (userId) {

  var surveyUserEmails = Meteor.users.findOne({_id: userId}).emails;

  if (surveyUserEmails.length > 0) {
    return surveyUserEmails[0].address;
  }
  else {
    return false;
  }
};

Template.survey.helpers({
  formateDate: function (date) {
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();
  }
});

Template.survey.surveyUserEmail = function (userId) {

  var surveyUserEmails = Meteor.users.findOne({_id: userId}).emails;

  if (surveyUserEmails.length > 0) {
    return surveyUserEmails[0].address;
  }
  else {
    return false;
  }
};

Template.survey.notAlreadySentSurvey = function (sessionId) {
  return !Sessions.findOne({_id: sessionId, surveys: {$elemMatch: {user_id: Meteor.userId()}}});
};

Template.survey.isSessionSpeakerOrAdmin = function (sessionId) {
  return TemplateUtils.isSessionSpeakerOrAdmin(sessionId);
};

Template.survey.events = {
  'click .submit': function (event) {

    event.preventDefault();
    event.stopPropagation();

    var userId = Meteor.userId();
    var form = $('.survey form');
    var comment = $('.survey textarea').val();
    var date = new Date();
    var questions = ['optionsQuestion1', 'optionsQuestion2', 'optionsQuestion3', 'optionsQuestion4'];
    var answers = [];

    form.validate({
      rules: {
        optionsQuestion1: "required",
        optionsQuestion2: "required",
        optionsQuestion3: "required",
        optionsQuestion4: "required",
        optionsQuestion5: "required"
      },
      focusInvalid: false
    });

    for (var i = 0; i < questions.length; i++) {
      $('select[name=' + questions[i] + ']').each(function () {
        answers.push({question: $(this).parent().prev('p').text(), answer: $(this).val()});
      });
    }

    if (form.valid()) {
      if (!Sessions.findOne({_id: this._id, surveys: {$elemMatch: {user_id: userId}}})) {
        Sessions.update({_id: this._id }, {$push: {surveys: {comment: comment, user_id: userId, postDate: date, answers: answers}} });
      }
    }
  }
};
