if (Meteor.isClient) {

  Meteor.startup(function () {
    console.log("client start")
 });

 /* Send a phone notification to user
 @param minutes : request for how many minutes to turn off AC
 @param tokens : tokens PowerLottery is offering if request is completed successfully
 */



 // Starts countdown from 10 minutes, retracts offer
 function offerExpire() {
 }

 // updates Client's Home Screen with New Token Offer
 function updateHomeScreenWithOffer() {


 }


 /* Template updating */
 Template.account.events({
   'click .accept': function() {
     console.log("acceptedOffer")
     Router.go('/time')
   }

});


Template.timeDisplay.helpers({
 timeLeft : function() {
   return Session.get("timeLeft");
 }
});

}
