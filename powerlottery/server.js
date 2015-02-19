// simple-todos.js
Tasks = new Mongo.Collection("tasks");

if (Meteor.isCordova) {
  console.log("Printed only in mobile cordova apps");

  Meteor.startup(function () {
      // any cordova api needs thi
      document.addEventListener("deviceready", onDeviceReady, false);
      var current_time = new Date().getTime();
      });

  function onDeviceReady() {
    // Now safe to use device APIs
   console.log("deviceready!!!");
 }

 /* Send a phone notification to user
 @param minutes : request for how many minutes to turn off AC
 @param tokens : tokens PowerLottery is offering if request is completed successfully
 */

 function sendNotification(minutes, tokens) {
   window.plugin.notification.local.add({
     id:      1, //TODO: change this to user id
     title:   tokens +  ' Token Offer',
     message: 'Offer expires in 10 minutes! Please turn off your AC for ' minutes + ' minutes for' + tokens + 'tokens',
     date:     new Date(current_time)
   });

   expirationTimer();
 }

 // Starts countdown from 10 minutes, retracts offer
 function offerExpire() {
 }
}

/* CLIENT */
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
