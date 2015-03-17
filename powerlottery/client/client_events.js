if (Meteor.isClient) {
  Template.userAccounts.events({
    'click [data-action=logout]': function () {
      AccountsTemplates.logout();
    }
  });

  Template.login.rendered =
    function() {
        Session.set("clickedLogin", true);
    };

  /* Events
  Template.main.events({
    'click .accept': function() {
      console.log("acceptedOffer");
      // Start timer, logging when they press "accept"
      var tempVal = 20; // TODO:use event.target.minutes.value to get offer minutes
      Meteor.call('beginTimer', new Date(), tempVal);
    },
     'click .accept': function() {
       console.log("acceptedOffer");
       Meteor.Router.to('/time');
     }
 });

*/
/*
Template._sideMenu.events({
   'click .logout': function(event){
     console.log("clickedlogoutNAVBAR");
      event.preventDefault();
      IonPopover.hide();
      Meteor.logout();
    },
    'click #settings': function(event) {
      console.log("settings");
      IonPopover.hide();
    }
});
*/

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
    var lookInDevices = devices.find({_id: d_id}).count();
    // Device in database. Valid device. Now check if it's already been claimed

    if (lookInDevices > 0) {
      // get the current device info
      var register_info = devices.find(
        {_id:d_id},
        { email: 1, status:1}).fetch();
        if (register_info[0].status == 0) {
          // unregistered valid device, continue
          Accounts.createUser({email: email, password : password, profile: {name: name, device_id: d_id,
            datejoined: new Date(), offers_completed: 0, total_tokens:0, current_offer_endtime: 0}}, function(err){
              if (err) {
                console.log(err);
                Session.set('response_msg', "Account creation failed");
                }
                else {
                  console.log("successfully added user");
                  // TODO: update with status of ac
                  devices.update({_id: d_id}, {$set: {status:1, uid: Meteor.userId()}});
                  }
                });
              }
        else {
          Session.set('response_msg', "This device has already been registered!");
          }
        }
    else if (lookInDevices == 0) {
      Session.set('response_msg', "Sorry, this device doesn't exist!");
    }
  }
});*/
}
