Template.hiscores.helpers({
  scores: function() {
    return Meteor.users.find({}, {
      sort: {
        total_tokens: 1
      },
      limit: 10
    }).map(function(user, index) {
      user.rank = index + 1;
      return user;
    });
  },
  ac_on: function() {
    return Meteor.user().profile.status == 1;
  },
  ac_disconnected: function() {
    return Meteor.user().profile.status == 2;
  },
});