/*
The interface for interacting with phone features
*/
if (Meteor.isCordova) {

  Meteor.startup(function () {
    document.addEventListener("deviceready", onDeviceReady, false);
  });

  function onDeviceReady() {
    console.log("deviceready!!!");
  }

  /* 
   * Send an offer notification to the phone
   *
  @param minutes : how many minutes to turn off AC
  @param tokens  : number of rewarded tokens if request is completed successfully
  */
  function sendOfferNotification(user_id, minutes, tokens) {
    var title = tokens + ' Token Offer';
    var message = 'Offer expires in 10 minutes! Please turn off your AC for ' + minutes + ' minutes for' + tokens + ' tokens';
    sendNotification(user_id, title, message);
  }
  
  /*
   * Sends a push notification to the phone
  */
  function sendNotification(user_id, title, message) {
    window.plugin.notification.local.add({
      id:       user_id,
      title:    title,
      message:  msg,
      date:     new Date().getTime()
    });
  }
}
