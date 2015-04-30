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
        if (Meteor.user().profile.current_offer_state == 1) {
          var timeLeftInSeconds = Math.ceil((offer.end_time - Session.get('serverTime'))/1000);
          Session.set('timeLeftInSeconds', timeLeftInSeconds);
          if (timeLeftInSeconds <= 0) {
            Meteor.call('expireOffer', Meteor.user()._id, function(err, data) {
              if (!data) {
                console.log("This should never be displayed... If it is then something is very wrong");
              }
            });
          }
        }
        else if (Meteor.user().profile.current_offer_state == 2) {

          var challengeEndTime = Meteor.user().profile.ac_end_time;
          var timeLeftInSeconds = Math.ceil((challengeEndTime - Session.get('serverTime'))/1000);
          Session.set('timeLeftInSeconds', timeLeftInSeconds);
          if (timeLeftInSeconds <= 0) {
            Meteor.call('updateOutstandingOffer', Meteor.user()._id, function(err, data) {
              // success
            });
          }
        }
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
    return Meteor.user().profile.total_offers_completed;
  },
  ac_on: function() {
    return Meteor.user().profile.status == 1;
  },
  ac_disconnected: function() {
    return Meteor.user().profile.status == 2;
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
    return Meteor.user().profile.current_offer_state == 1 && Session.get('offer');
  },
  inGame: function() {
    // user has accepted offer and it's in progress
    return Meteor.user().profile.current_offer_state == 2 &&
      Session.get('offer') && Meteor.user().profile.ac_end_time > Session.get('serverTime');
  },
  failed: function() {
    return Meteor.user().profile.current_offer_state == 4 && Session.get('offer');
  },
  success: function() {
    return Meteor.user().profile.current_offer_state == 3 && Session.get('offer');
  }
});

Template.history_list.helpers({
  getHistory: function() {
    return Meteor.user().profile.past_offers;
  },
  succeededOffer: function() {
    return this.status == 1;
  },
  timeOffer: function() {
    d = new Date(this.end_time);
    return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
  }
});
