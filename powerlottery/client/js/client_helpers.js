if (Meteor.isClient) {

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
  current_offer: function() {
    console.log(Meteor.user().profile.current_offer_id != "");
    return (Meteor.user().profile.current_offer_id != "");
  }
})

Template.timeDisplay.helpers({
  minutes : function() {
    return minutesLeft.get();
    },
  seconds : function() {
    return secondsLeft.get();
    }
  });
}
