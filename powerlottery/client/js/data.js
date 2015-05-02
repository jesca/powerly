Template.data.helpers({
  power_usage: function() {
    return Meteor.user().profile.power_usage;
  }
});
