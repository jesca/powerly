if (Meteor.isClient) {

  Meteor.methods( {
    // Begin the countdown after the user accepted the offer for a @totalMinutes
    // If your app is asleep, there's no need for it to continue timer processing or
    //update a screen. In the app "pause" event, kill your timer and stop updating the screen.
    //In the app "resume" event, immediately update the screen again, and restart your timer.

    'beginTimer': function(beginDate, sessionMinutes){
      s = sessionMinutes
      Router.go('/time');
      console.log("started timer for " + s);
      endDate = new Date(beginDate.getTime() + (sessionMinutes*60000)); // 60000 being the number of milliseconds in a minute
      minutesLeft = new ReactiveVar(new Date(endDate - beginDate).getMinutes());
      secondsLeft = new ReactiveVar(new Date(endDate - beginDate).getSeconds());

      function timer() {
        var dateNow = new Date();
        console.log(endDate);
        timeleft = new Date(endDate - dateNow);
        console.log(timeleft);
        minutesLeft.set(timeleft.getMinutes());
        secondsLeft.set(timeleft.getSeconds());
        var cont = setInterval(function(){ timer() }, 1000);
        }
      timer();

    },


  });
//TODO: show only minutes option in settings, default is a countdown timer with min: seconds
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
     // Start timer, logging when they press "accept"
     var tempVal = 20; // TODO:use event.target.minutes.value to get offer minutes
     Meteor.call('beginTimer', new Date(), tempVal);
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
