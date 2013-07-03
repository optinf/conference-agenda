Template.social.rendered = function() {
  !function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      js = d.createElement(s);
      js.id = id;
      js.src = "//platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);
  }(document, "script", "twitter-wjs");
  };

Template.social.findSpeakerWithTwitter = function() {
  return Meteor.users.find({speaker: true, twitter: {$exists: true }});
};
