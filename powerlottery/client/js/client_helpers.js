if (Meteor.isClient) {
  Meteor.methods( {
    setTimeLeft: function() {
      var sessionMinutes = 
      endDate = new Date(Meteor.call('getCurrentTime') + (sessionMinutes*60000)); // 60000 being the number of milliseconds in a minute
      minutesLeft = new ReactiveVar(new Date(endDate - beginDate).getMinutes());
      secondsLeft = new ReactiveVar(new Date(endDate - beginDate).getSeconds());

      function timer() {
        // poll database to see if currently still in offer
        // if failed : call failedMethod
        // if still in offer: update timer

        // call timer method from server for the minutes and seconds in sec
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

  /* 
  to find out if there is a current offer, look in the offer database to see if there is an offer
  */
  'current_offer': function() {
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
