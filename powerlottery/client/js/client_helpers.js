if (Meteor.isClient) {
  Meteor.methods( {
    setTimeLeft: function() {
      var offer = Session.get('offer');
      console.log("offer from session var " + offer._id)
      timeLeft = new Date(offer._id - Meteor.call('getCurrentTime'));
      console.log("time left " + timeLeft)
      minutesLeft = new ReactiveVar(timeLeft.getMinutes());
      secondsLeft = new ReactiveVar(timeLeft.getSeconds());

      var timer = function () {
        // poll database to see if currently still in offer
        // if failed : call failedMethod
        // if still in offer: update timer
        timeLeft = new Date(offer._id - Meteor.call('getCurrentTime'));
        minutesLeft.set(timeleft.getMinutes());
        secondsLeft.set(timeleft.getSeconds());
      }

      setInterval(timer, 1000);
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
  minutes : function() {
    return minutesLeft.get();
  },
  seconds : function() {
    return secondsLeft.get();
  },
  offer : function() {
    return Session.get('offer');
  },
  /*
  to find out if there is a current offer, look in the offer database to see if there is an offer
  0: None
  1: Not accepted
  2: accepted
  3: success
  4: fail
  */
  getOffer: function() {
    var uid = Meteor.userId();
    var offerStatus = Meteor.user().profile.current_offer_state;
    var offerId = Meteor.user().profile.current_offer_id;

    if (offerStatus == 1) {
      // there is an offer that has not been accepted yet
      //TODO: update timer to count down 10 minutes from when the offer is sent
      Session.set('offer', offers.findOne({'_id': offerId}));
      console.log(offers.findOne({'_id': offerId}));
      Meteor.call("setTimeLeft");
      return true;
    }
    return false;

    /*
    offer = Meteor.call('getCurrentOffer');
    console.log("offer is " + offer);
    if (offer) {
      // set offer time (endTime in milliseconds)
      Session.set(offer);
      setTimeLeft(offer);
      return true;
    }
    else {
    // no offer right now
      return false;
    }*/
  }


  });


}
