function displayError(message) {

  $('.alert').remove();
  var alertError = '<div style="text-align: center" class="alert alert-error">' + message + '</div>';
  $(alertError).insertAfter('.submit');
}

function displaySuccess(message) {
  $('.alert').remove();
  var alertError = '<div style="text-align: center" class="alert alert-success">' + message + '</div>';
  $(alertError).insertAfter('#submit');
}

Template.login.events = {
  'click #login #submit': function (event) {

    var email = $('#inputEmail').val().toLowerCase();
    var password = $('#inputPassword').val();
    var message = '';
    event.preventDefault();
    event.stopPropagation();

    Meteor.loginWithPassword(email, password, function (error) {

      if (error) {
        if (error.error === 400) {
          message = "Vous devez remplir tous les champs."
        }
        else if (error.error === 403) {
          message = "Le courriel ou le mot de passe n'est pas valide."
        }
        else {
          message = "Erreur inconnue"
        }

        displayError(message);
      }
      else {
        Meteor.Router.to('/');
      }
    });
    return false;
  },
  'click #create': function (event) {

    var email = $('#inputEmail').val().toLowerCase();
    var password = $('#inputPassword').val();
    var form = $('#login');

    var message = '';
    event.preventDefault();
    event.stopPropagation();

    form.validate({
      rules: {
        'inputPassword': {
          required: true,
          minlength: 6
        },
        'inputEmail': {
          required: true,
          email: true
        }
      },
      focusInvalid: false
    });

    if (form.valid()) {
      Accounts.createUser({email: email, password: password}, function (error) {

        if (error) {
          if (error.error === 403) {
            message = "Ce courriel existe déjà"
          }
          else {
            message = "Erreur inconnue"
          }

          displayError(message);
        }
        else {
          Meteor.Router.to('/');
        }
      });
    }
    return false;
  }
};


Template.forgot_password.events = {
  'click #forgot-password #submit': function (event) {

    event.preventDefault();
    event.stopPropagation();

    var form = $('#forgot-password');
    form.validate({
      rules: {
        'inputEmail': {
          required: true,
          email: true
        }
      },
      focusInvalid: false
    });

    if (form.valid()) {

      var email = $('#forgot-password-email').val();
      Accounts.forgotPassword({email: email}, function (error) {

        if (error) {
          displayError('Erreur, ce courriel n\'est pas valide.');
        }
        else {
          displaySuccess('Le courriel a été envoyé.');
        }
      });
    }
  }
};

