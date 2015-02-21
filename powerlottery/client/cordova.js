if (Meteor.isCordova) {

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

 function sendNotificationToPhone(minutes, tokens) {
   window.plugin.notification.local.add({
     id:      1, //TODO: change this to user id
     title:   tokens +  ' Token Offer',
     message: 'Offer expires in 10 minutes! Please turn off your AC for ' + minutes + ' minutes for' + tokens + ' tokens',
     date:     new Date(current_time)
   });

   offerExpire();
 }

 // Starts countdown from 10 minutes, retracts offer
 function offerExpire() {
 }

 // updates Client's Home Screen with New Token Offer
 function updateHomeScreenWithOffer() {


 }


 /* Template updating */
 Template.account.events({
   'click .accept': function() {
     console.log("acceptedOffer");
     Meteor.Router.to('/time');
   }

});


Template.timeDisplay.helpers({
 timeLeft : function() {
   return Session.get("timeLeft");
 }
});

}
