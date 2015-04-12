Meteor.startup(function () {
  setInterval(function() {
    Meteor.call('getCurrentTime', function(err, time) {
      Session.set('serverTime', time);
    });
  }, 1000);
  Tracker.autorun(function() {
    if (Meteor.user()) {
      var offerId = Meteor.user().profile.current_offer_id;
      var offer = offers.findOne({'_id': offerId});
      if (offer) {
        Session.set('offer', offer);
        Session.set('timeLeftInSeconds', Math.floor((offer._id - Session.get('serverTime'))/1000));
      }
    }
  });
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
  minutes: function() {
    return Math.floor(Session.get('timeLeftInSeconds') / 60);
  },
  seconds: function() {
    var seconds = '' + (Session.get('timeLeftInSeconds') % 60);
    return "00".substring(0, 2 - seconds.length) + seconds;
  },
  offer: function() {
    return Session.get('offer');
  },
  /*
  0: None
  1: Not accepted
  2: accepted
  3: success
  4: fail
  */
  hasOffer: function() {
    return Meteor.user().profile.current_offer_state == 1 &&
      Session.get('offer');
  }
});
