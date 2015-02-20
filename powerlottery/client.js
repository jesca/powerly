/* CLIENT SIDE CODE*/
if (Meteor.isClient) {


  /* Templates */
  function onDeviceReady() {
    // Now safe to use device APIs
   console.log("deviceready!!!");
 }

Template.offerDetails.helpers({
  noTokens: function (tokens_to_be_awarded) {
    return tokens_to_be_awarded
  }
});

Template.offerDetails.helpers({
  timeLeft: function () {
    return counter.get();
    }
});

setInterval(function (interval) {
  counter.set(counter.get() + 1);
  }, interval);

}
