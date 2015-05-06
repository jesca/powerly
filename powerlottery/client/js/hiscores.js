Template.hiscores.helpers({
  scores: function() {
    return Meteor.users.find({}, {sort: {total_tokens: -1}, limit: 10}).fetch();
  },
  ac_on: function() {
    return Meteor.user().profile.status == 1;
  },
  ac_disconnected: function() {
    return Meteor.user().profile.status == 2;
  },
});
