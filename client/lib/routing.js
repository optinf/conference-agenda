Meteor.Router.add({
  '/': 'agenda',
  '/programmation': 'schedule',
  '/agenda': 'agenda',
  '/social': 'social',
  '/partenaires': 'partners',
  '/connecter': 'login',
  '/mot-de-passe-oublie': 'forgot_password',
  '/administration/:id': function (id) {
      return 'admin_' + id;
  },
  '/programmation/session/:id': function (id) {
    Session.set('currentSessionId', id);
    return 'session';
  }
});
