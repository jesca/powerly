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
    'click [data-action="showPopupDscAC"]': function(event, template) {
      IonPopup.show({
        template: 'Please reconnect your Powerly tracking device',
        buttons: [{
          text: 'Ok',
          type: 'button-positive',
          onTap: function() {
            IonPopup.close();
          }
        }]
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

Template.challenge.events({
  'click #acceptOffer': function() {
      Meteor.call("acceptOffer", Meteor.user()._id, function(err, data) {
          // offer is now accepted
      });
  },
  'click #acknowledgeSuccess': function() {
    //Resets the user's current_offer_state and current_offer_id to 0
    Meteor.call("resetUserStates", Meteor.user()._id, function(err, data) {
  });
  },
  'click #acknowledgeFailure': function() {
    //Resets the user's current_offer_state and current_offer_id to 0
    Meteor.call("resetUserStates", Meteor.user()._id, function(err, data) {
  });
  }
})
}
