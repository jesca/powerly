if (Meteor.isClient) {
/* Template helpers */
 Template.login_register_page.helpers({
   clickedLogin: function() {
     return Session.get("clickedLogin");
     },
   clickedRegister: function() {
     return Session.get("clickedRegister");
   },
   cur_user: function() {
     console.log(Meteor.user().email);
     console.log(Meteor.user());
     return Meteor.user().emails[0];
   }
   });

 Template.registerForm.helpers( {
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
