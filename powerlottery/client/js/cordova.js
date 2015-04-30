if (Meteor.isCordova) {

  Meteor.startup(function () {
    document.addEventListener("deviceready", onDeviceReady, false);
  });

  function onDeviceReady() {
    console.log("deviceready!!!");
  }
}
