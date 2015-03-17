if (Meteor.isServer) {
  Meteor.publish("devices", function () {
    return devices.find();
  });
}


Accounts.onCreateUser(function(options, user) {
    console.log(user);
    return user;
  });
