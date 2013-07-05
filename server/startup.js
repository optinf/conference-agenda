/**
 * !! Important
 * Everything here needs to be customized.
 * The information already entered only serves as an example.
 *
 */


Meteor.startup(function () {

  /**
   * Emails configurations
   *
   */
  process.env.MAIL_URL = 'smtp://...';

  Accounts.emailTemplates.siteName = "Site name";
  Accounts.emailTemplates.from = "Email from";
  Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Compte *** 2013";
  };

  Accounts.emailTemplates.enrollAccount.text = function (user, url) {
    return "Bonjour,\n\n"
        + "Pour activer votre compte veuillez cliquer le lien ci-dessous :\n\n"
        + url;
  };

  Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Réinitialisation du mot de passe *** 2013"
  };

  Accounts.emailTemplates.resetPassword.text = function (user, url) {
    return "Bonjour,\n\n"
        + "Pour réinitialiser votre mot de passe, veuillez cliquer le lien ci-dessous :\n\n"
        + url;
  };

  /**
   * Set basic informations of the users only at the first boot up.
   */
  if (Meteor.users.find().count() === 0) {

    /**
     * These accounts are linked to the event sessions via id.
     * You can give access to these special accounts via the admin control panel.
     */
    Meteor.users.insert({id: 1, firstName: "George", lastName: "LePresentateur", speaker: true, twitter: "george"});
    Meteor.users.insert({id: 2, firstName: "Patrick", lastName: "L'autrePresentateur", speaker: true, twitter: "patrick"});


    /**
     * This account can do everything. Don't leave this unmodified. Don't leave the password as plain text.
     */
    Accounts.createUser({username: 'admin', email: "test@test.com", password: 'admin'});
    Meteor.users.update({'username': 'admin'}, {$set: { admin: true}});


    /**
     * Lorem for the speakers bio
     */
    var bio = "<h3>Conférencier</h3>Aenean pellentesque erat nec elit luctus in tristique augue scelerisque. Praesent a ipsum et arcu rutrum sagittis non sit amet purus. Aliquam vel nisi sit amet tortor lobortis lacinia vel nec diam. Etiam vehicula tortor in ligula condimentum volutpat. In hac habitasse platea dictumst. Fusce sed ligula enim. Aenean interdum dolor non sem accumsan semper. Sed ac urna ut nisl consectetur vulputate. Nullam quis erat et turpis pulvinar facilisis a non dui.";
    Meteor.users.update({speaker: true}, { $set: {bio: bio}}, { multi: true });
  }


  /**
   * Set basic informations for the sessions. Only at the first boot up.
   * Some information will not be modifiable via the UI after. You will have to update the document in the DB directly.
   */
  if (Sessions.find().count() === 0) {

    /**
     *  All the information needed for the sessions
     *
     *  name : String
     *  startHour, endHour, startMinutes, endMinutes : int
     *  speaker: int, If the session has a speaker account linked to it. Put the ID (specified when you create the user) of the user or false.
     *  attendable: If the session can be added to the agenda.
     *  description: String
     *  location: String
     */
    var sessionsInformations = [
      {
        name: "Session 1",
        startHour: 8,
        startMinutes: 0,
        endHours: 9,
        endMinutes: 0,
        speaker: 1,
        attendable: true,
        description: "Nunc vitae mauris dolor. Mauris urna lorem, rutrum quis posuere in, condimentum ac nunc.",
        location: "Caféteria"
      },
      {
        name: "Pause",
        startHour: 9,
        startMinutes: 0,
        endHours: 9,
        endMinutes: 30,
        speaker: 2,
        attendable: false,
        description: "Nunc vitae mauris dolor. Mauris urna lorem, rutrum quis posuere in, condimentum ac nunc.",
        location: ""
      },
      {
        name: "Session 2",
        startHour: 19,
        startMinutes: 0,
        endHours: 20,
        endMinutes: 0,
        speaker: 2,
        attendable: true,
        description: "Nunc vitae mauris dolor. Mauris urna lorem, rutrum quis posuere in, condimentum ac nunc.",
        location: "Salle A"
      }
    ];

    function newDate(hours, minutes) {
      var date = new Date();

      date.setHours(hours);
      date.setMinutes(minutes);

      return date;
    }

    var startDate = [];
    var endDate = [];

    for (var i = 0; i < sessionsInformations.length; i++) {

      startDate = newDate(sessionsInformations[i].startHour, sessionsInformations[i].startMinutes);
      endDate = newDate(sessionsInformations[i].endHours, sessionsInformations[i].endMinutes);

      Sessions.insert({
        name: sessionsInformations[i].name,
        description: sessionsInformations[i].description,
        subscriptions: [],
        speaker: sessionsInformations[i].speaker,
        location: sessionsInformations[i].location,
        date: {start: startDate, end: endDate},
        'attendable': sessionsInformations[i].attendable,
        sequence: i
      });
    }
  }
});
