devices = new Mongo.Collection('devices');

if (Meteor.isServer) {
  Meteor.startup(function () {
    // clear the devices db on startup
    devices.remove({});
  });
}
