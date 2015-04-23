Template.hiscores.helpers({
  scores: function() {
    return Meteor.users.find({}, {sort: {total_tokens: -1}, limit: 10}).fetch();
  }
});
