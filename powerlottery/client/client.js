if (Meteor.isClient) {

  Meteor.methods( {
    // Begin the countdown after the user accepted the offer for a @totalMinutes
    /* If your app is asleep, there's no need for it to continue timer processing or
    update a screen. In the app "pause" event, kill your timer and stop updating the screen.
    In the app "resume" event, immediately update the screen again, and restart your timer.*/
    'beginTimer': function(beginDate, sessionMinutes) {
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
    }
  });

  /* Template updating */
  Template.main.events({
    'click .accept': function() {
      console.log("acceptedOffer")
      // Start timer, logging when they press "accept"
      var tempVal = 20; // TODO:use event.target.minutes.value to get offer minutes
      Meteor.call('beginTimer', new Date(), tempVal);
    },

    'click #login-button': function() {
      Session.set("clickedRegister", false);
      Session.set("clickedLogin", true);
    },

    'click #register-button': function() {
      Session.set("clickedLogin", false);
      Session.set("clickedRegister", true);
    },

    'click .logout': function(event){
       event.preventDefault();
       Meteor.logout();
     },

     'click #settings': function(event) {
       event.preventDefault();
       Router.go('/settings');
     },
     
     'click .accept': function() {
       console.log("acceptedOffer");
       Meteor.Router.to('/time');
     }
  });

  Template.main.helpers({
    clickedLogin: function() {
      return Session.get("clickedLogin");
    },
    clickedRegister: function() {
      return Session.get("clickedRegister");
    }
  });

  Template.registerForm.helpers( {
   response_msg: function() {
     return Session.get("response_msg");
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
      d_id = "" + t.find('#device-id').value + "";
      // Check if device is in the device database
      // TODO: Currently in progress
      lookInDevices = devices.find({_id: d_id}).count();
      test = devices.find({_id: d_id});
      if (lookInDevices > 0) {
       console.log("device already in database");
       name = devices.find(
         {_id:d_id},
           { name: 1, _id:0}
       );
      }
      else if (lookInDevices == 0) {
       console.log("not a valid device")
       Session.set('response_msg', "Sorry, this device doesn't exist!");
      }
      else {
        console.log(lookInDevices);
        Accounts.createUser(
          {
            email: email, 
            password : password, 
            device_id: d_id, 
            datejoined: new Date(), 
            offers_completed: 0, 
            total_tokens:0, 
            current_offer_endtime: 0
          }, 
          function(err) {
            if (err) {
              // Inform the user that account creation failed
            } else {
              console.log("successfully added user")
              devices.update({_id: d_id}, {$set: {owner:email}});
              // Success. Account has been created and the user
              // has logged in successfully.
            }
          }
        );
        return false;
      }
    }
  });

  Template.timeDisplay.helpers({
    minutes : function() {
      return minutesLeft.get();
    },
    seconds : function() {
      return secondsLeft.get();
    },
    timeLeft : function() {
      return Session.get("timeLeft");
    }
  });
}
