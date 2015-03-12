if (Meteor.isClient) {

Meteor.methods( {
  // Begin the countdown after the user accepted the offer for a @totalMinutes
  /* If your app is asleep, there's no need for it to continue timer processing or
  update a screen. In the app "pause" event, kill your timer and stop updating the screen.
  In the app "resume" event, immediately update the screen again, and restart your timer.*/
  'beginTimer': function(beginDate, sessionMinutes) {
    s = sessionMinutes
    Router.go('/time');
    console.log("started timer for " + s);
    endDate = new Date(beginDate.getTime() + (sessionMinutes*60000)); // 60000 being the number of milliseconds in a minute
    minutesLeft = new ReactiveVar(new Date(endDate - beginDate).getMinutes());
    secondsLeft = new ReactiveVar(new Date(endDate - beginDate).getSeconds());

    function timer() {
      var dateNow = new Date();
      timeleft = new Date(endDate - dateNow);
      minutesLeft.set(timeleft.getMinutes());
      secondsLeft.set(timeleft.getSeconds());
      var cont = setInterval(function(){ timer() }, 1000);
    }
    timer();
  }
});
}
