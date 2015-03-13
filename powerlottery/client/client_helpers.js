if (Meteor.isClient) {

/* Template helpers */
Template.main.helpers({
  name: function() {
    return Meteor.user().profile.name;
  },
  tokens: function() {
    return Meteor.user().profile.total_tokens;
  },
  offers_completed: function() {
    return Meteor.user().profile.offers_completed;
  }
})

Template.login.helpers({
  clickedLogin: function() {
        return Session.get("clickedLogin");
    },
    clickedRegister: function() {
        return Session.get("clickedRegister");
    }
});

Template.registerForm.helpers( {
  response_msg: function() {
  return Session.get("response_msg");
  }
  });

Template.loginForm.helpers( {
  response_msg: function() {
  return Session.get("response_msg");
  }
  });

Template.timeDisplay.helpers({
  minutes : function() {
    return minutesLeft.get();
    },
  seconds : function() {
    return secondsLeft.get();
    }
  });
}
