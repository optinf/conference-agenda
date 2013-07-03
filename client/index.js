
Template.header.rendered = function () {

  //Navigation active
  $('a[href="/' + Meteor.Router.page() + '"]').parent().addClass('active');
  $('a[rel*="' + Meteor.Router.page() + '"]').parent().addClass('active');
};

Template.header.isNotLoginPage = function () {
  return Meteor.Router.page() !== 'login';
};

//TODO Add you filepicker key here.
Meteor.startup(function () {
  filepicker.setKey("keyOfFilePicker");
});

Template.header.events = {

  'click #disconnect': function (event) {
    Meteor.logout();
    Meteor.Router.to('/');
  }
};

