if (Meteor.isServer) {


Accounts.onCreateUser(function(options, user) {
    console.log(user);
    return user;
  });
}
