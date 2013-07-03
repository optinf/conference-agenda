Template.questionnaire.isSessionSpeakerOrAdmin = function (sessionId) {
  return TemplateUtils.isSessionSpeakerOrAdmin(sessionId);
};

Template.questionnaire.questionnaires = function (sessionId) {
  return Questionnaire.find({sessionId: sessionId});
};

Template.questionnaire.events = {

  'click #admin .add-choice': function (event) {

    $('.add-choice').remove();
    $('.choices').append('<div class="input-append"><input type="text" name="new-choice" class="new-choice" placeholder="Choix de réponse"/><button class="btn add-choice" type="button">Ajouter un autre choix</button></div>');
  },
  'click #add-questionnaire': function (event) {

    event.preventDefault();
    event.stopPropagation();

    var choices = [];
    var question = $('#new-question').val();
    var sessionId = $('#session-id').val();
    var form = $('form#admin');

    $('.new-choice').each(function (i) {
      if ($(this).val() !== '') {
        choices.push({value: i, label: $(this).val(), count: 0});
      }
    });

    form.validate({
      rules: {
        'new-question': "required",
        'new-choice': "required"
      },
      focusInvalid: false
    });

    if (form.valid()) {

      Questionnaire.insert({
        sessionId: sessionId,
        question: question,
        choices: choices
      });
    }
    //The questionnaire will load with meteor reactivity, no need to reload page...
    return false;
  },
  'click .activate-questionnaire' : function(event) {
    var questionnaireId  = $(event.currentTarget).closest('input').val();
    var questionnaire = Questionnaire.findOne({_id : questionnaireId});
    Questionnaire.update({_id: questionnaireId}, {$set: {activated : !questionnaire.activated}});
  },
  'click .remove-questionnaire' : function (event) {
    var questionnaireId = $(event.currentTarget).closest('input').val();
    console.log(questionnaireId);
    Questionnaire.remove({_id : questionnaireId});
  },
  'click .send-questionnaire' : function(event) {
    var id = this._id;
    var valueSelected =$('#questionnaire-' + id + ' select').val();
    var question = Questionnaire.findOne({_id: id});
  }
};

