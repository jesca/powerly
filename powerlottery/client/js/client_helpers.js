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

/* Template helpers */
Template.main.helpers({
  name: function() {
    return Meteor.user().profile.name;
  },
  tokens: function() {
    return Meteor.user().profile.total_tokens;
  },
  offers_completed: function() {
    return Meteor.user().profile.completed_offer_ids.length;
  },
  ac_on: function() {
    return Meteor.user().profile.status == 1;
  },

  /* the current_offer in the user_database is a tuple: [offer_id, status, timer_end]
  the status is either 0 (not accepted) or 1 (accepted)
  if status is 0, timer_end is how much longer they have to accept the offer
  if status is 1, timer_end is how much longer they have until they successfully complete the offer
  */
  current_offer: function() {
    //
    var uid = Meteor.userId();
    var cur_offer = Meteor.user().profile.current_offer;
    var offer_id = cur_offer[0];
    var offer_status = cur_offer[1];
    var timer_end = cur_offer[2];

    if (current_offer != "") {
      // there is an offer

      // offer details returns the offer obj from the offer database: {_id (timestamp), tokensOffered, offerLength
      var offer_details = Meteor.call('getOfferDetails', current_offer, uid);

      if (offer_status == 0) {
        // offer has not been accepted yet
        //TODO: update timer to count down 10 minutes from when the offer is sent
      }
      else if (offer_status == 1) {
        // user has accepted the offer

        if (offer_details != false) {
          return offers.find({_id:offer_timestamp_id}).fetch();
        }
        else {
          // offer returned false
          return false;
          }

      }
    }
    else {
      // no current offer
      return false
      }
    },
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
