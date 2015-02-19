/* CLIENT SIDE CODE*/
if (Meteor.isClient) {
  Template.timer.events({
    'click button': function() {
      Session.set("tt",22)
      console.log('start timer');

    }

});


Template.timer.helpers({
  tt : function() {
    return Session.get("tt");
  }

});


  // Page will change to say "We've always been at war with Eurasia"
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});
}
