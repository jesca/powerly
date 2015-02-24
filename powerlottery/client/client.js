if (Meteor.isClient) {

  Meteor.methods( {
    // Begin the countdown after the user accepted the offer for a @totalMinutes
    /* If your app is asleep, there's no need for it to continue timer processing or
    update a screen. In the app "pause" event, kill your timer and stop updating the screen.
    In the app "resume" event, immediately update the screen again, and restart your timer.*/
    'beginTimer': function(beginDate, sessionMinutes){
      s = sessionMinutes
      Router.go('/time');
      console.log("started timer for " + s);
      endDate = new Date(beginDate.getTime() + (sessionMinutes*60000)); // 60000 being the number of milliseconds in a minute
      minutesLeft = new ReactiveVar(new Date(endDate - beginDate).getMinutes());
      secondsLeft = new ReactiveVar(new Date(endDate - beginDate).getSeconds());

      function timer() {
        var dateNow = new Date();
        timeleft = new Date(endDate - dateNow);
        minutesLeft.set(timeleft.getMinutes());
        secondsLeft.set(timeleft.getSeconds());
        var cont = setInterval(function(){ timer() }, 1000);
        }
      timer();

    },


  });

 /* Template updating */
  Template.main.events({
    'click .accept': function() {
      console.log("acceptedOffer")
      // Start timer, logging when they press "accept"
      var tempVal = 20; // TODO:use event.target.minutes.value to get offer minutes
      Meteor.call('beginTimer', new Date(), tempVal);
    },

    'click .logout': function(event){
         event.preventDefault();
         console.log('logginout');
         Meteor.logout();
     }
 });

 Template.loginForm.events({

   'submit #login-form' : function(e, t){
     e.preventDefault();
     // retrieve the input field values
     var email = t.find('#login-email').value
       , password = t.find('#login-password').value;

       // Trim and validate your fields here....

       // If validation passes, supply the appropriate fields to the
       // Meteor.loginWithPassword() function.
       Meteor.loginWithPassword(email, password, function(err){
       if (err) {

       }
         // The user might not have been found, or their passwword
         // could be incorrect. Inform the user that their
         // login attempt has failed.
       else {

       }
         // The user has been logged in.
     });
        return false;
     }
 });


 Template.registerForm.events({
   'submit #register-form' : function(e, t) {
     e.preventDefault();

     // Trim and validate the input
     var trimInput = function(val) {
       return val.replace(/^\s*|\s*$/g, "");
     }
     var email = trimInput(t.find('#account-email').value),
     password = t.find('#account-password').value,
     device_id = t.find('#device_id'.value);
     Accounts.createUser({email: email, password : password, device_id: device_id, datejoined: new Date(), offers_completed: 0, total_tokens:0, current_offer_endtime: 0}, function(err){
       if (err) {
         // Inform the user that account creation failed
         } else {
           // Success. Account has been created and the user
           // has logged in successfully.
           }

           });
           return false;
           }
        });

Template.registerForm.events({
    'submit #register-form' : function(e, t) {
      e.preventDefault();
      var email = t.find('#account-email').value
        , password = t.find('#account-password').value;

        // Trim and validate the input

      Accounts.createUser({email: email, password : password}, function(err){
          if (err) {
            // Inform the user that account creation failed
          } else {
            // Success. Account has been created and the user
            // has logged in successfully.
          }

        });

      return false;
    }
  });

Template.timeDisplay.helpers({
  minutes : function() {
    return minutesLeft.get();
  },

  seconds : function() {
    return secondsLeft.get();
  }

});

}
