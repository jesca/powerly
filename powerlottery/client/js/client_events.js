if (Meteor.isClient) {
  Template.userAccounts.events({
    'click [data-action=logout]': function () {
      Meteor.logout();
    }
  });
  Template._sideMenu.events({
    'click [data-action=logout]': function () {
      Meteor.logout();
    }
  });



Template.main.events({
    'click #acceptOffer': function() {
        Meteor.call("acceptOffer", Meteor.user()._id, function(err, data) {
            // offer is now accepted
        });
    },
});


Template._sideMenu.events({
   'click #logout': function(event){
     console.log("clickedlogoutNAVBAR");
      IonPopover.hide();
      Meteor.logout();
    },
    'click #settings': function(event) {
      console.log("settings");
      IonPopover.hide();
    }
});


/*
 Template.login.events({
   'click #login-button': function() {
     Session.set("clickedRegister", false);
     Session.set("clickedLogin", true);
   },
   'click #register-button': function() {
     Session.set("clickedLogin", false);
     Session.set("clickedRegister", true);
   }
 });

 Template.loginForm.events({
  'submit #login-form' : function(e, t){
    // retrieve the input field values
    var email = t.find('#login-email').value
      , password = t.find('#login-password').value;
      // TODO: Trim and validate your fields here....
      Meteor.loginWithPassword(email, password, function(err){
        if (err) {
          Session.set('response_msg', "Invalid credentials!");
          }
        else {
        //user has been logged in
        }
      });
      return false;
    }
 });

*//*
 Template.registerForm.events({
  'submit #register-form' : function(e, t) {
    e.preventDefault();
    // Trim and validate the input
    var trimInput = function(val) {
      return val.replace(/^\s*|\s*$/g, "");
    }
    var email = trimInput(t.find('#account-email').value),
    name = t.find('#account-name').value,
    password = t.find('#account-password').value,
    d_id = "" + t.find('#device-id').value + "";

    // Check if device is in the device database
    Meteor.call("realdeviceid", d_id, function(err, data){
      if (data > 0) {
        // Device in database. Valid device. Now check if it's already been claimed
        Meteor.call("isAvail", d_id, function(err, data){
          if (data == 0) {
            // unregistered valid device, continue
            Accounts.createUser({email: email, password : password, profile: {name: name, device_id: d_id,
              datejoined: new Date(), offers_completed: 0, total_tokens:0, current_offer_endtime: 0}}, function(err){
                if (err) {
                  console.log(err);
                  Session.set('response_msg', "Account creation failed");
                  }
                else {
                  Meteor.call("addUsertoDevice", d_id, Meteor.userId());
                }
              });
          }
          else {
              console.log("registeredalready");
            Session.set('response_msg', "This device has already been registered!");
          }
        });
      }
      else if (data == 0) {
          console.log("not exist");
          Session.set('response_msg', "Sorry, this device doesn't exist!");
      }
    });
  }
<<<<<<< HEAD
});*/

}
