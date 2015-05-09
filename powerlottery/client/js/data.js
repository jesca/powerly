Template.data.helpers({
  power_usage: function() {
    return Meteor.user().profile.power_usage;
  },
  ac_on: function() {
    return Meteor.user().profile.status == 1;
  },
  ac_disconnected: function() {
    return Meteor.user().profile.status == 2;
  },
});
