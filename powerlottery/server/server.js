Accounts.onCreateUser(function(options, user) {
    if (options.profile) {
    user.profile = options.profile;
    }
    Meteor.call('addUsertoDevice', user.profile.device_id)
    user.profile.total_tokens = 0;
    user.profile.current_offer_id = "";
    user.profile.current_offer_state = 0
    user.profile.ac_end_time = 0;
    user.profile.past_offers = [];
    user.profile.power_usage = 0;
    user.profile.status = 2;
    return user;
});

Meteor.methods({
    getCurrentTime: function() {
        // return time in milliseconds
        return new Date().getTime();
    },

    expireOffer: function(userId) {
        // expires the 1st phase offer
        var user = Meteor.users.findOne({_id:userId});
        var offerEnd = user.profile.current_offer_id;
        if (new Date().getTime() < offerEnd) {
            return false;
        }
        Meteor.users.update({_id:userId},{$set: {"profile.current_offer_id": "", "profile.current_offer_state": 0}});
        return true;
    },

    /*
        If there is no current offer, create the new offer!
        the client side will listen for the new offer in the offer table
        and update the UI and try to get the user to accept it
    */
    attemptCreateAndSendOffer: function() {
        if (offers.find({_id: { $gte: new Date().getTime() }}).fetch().length == 0) {
            var offerLength = 60 * 10 * 1000;
            var endTime = '' + (new Date().getTime() + offerLength);
            offers.insert({
                _id: endTime,
                tokensOffered: 10
            }, function(error, result) {});

            /*
              Updates all users whose offer status is not accepted to pending and sets offerId to endtime
              offerStatus = 0 - none, 1 - pending, 2 - accepted, 3 - success, 4 - fai
            */
            Meteor.users.update({"profile.current_offer_state": {$ne:2}}, {$set: {"profile.current_offer_state": 1, "profile.current_offer_id": endTime}}, {multi:true});
        }
    },

    /*
        This will be triggered originally from the client side if
        the user accepts the offer
        update userId with accepted when client side accepts offer
    */
    acceptOffer: function(userId) {
        var user = Meteor.users.findOne({_id:userId});
        var offerId = user.profile.current_offer_id;
        var status = user.profile.current_offer_state;
        if (status == 1 && offerId != "") {
            var challengeLength = 1000 * 10;
            var challengeEnd = new Date().getTime() + challengeLength;
            Meteor.users.update({_id: userId}, {$set: {"profile.current_offer_state": 2, "profile.ac_end_time": challengeEnd}});
        }
    },

    /*
        Updates the offer, this method will be polled by the client

        if the time is up, adds to the succeeded offers and awards tokens
        else, add to the failed offers
    */
    updateOutstandingOffer: function(userId) {
        // Updates user with userId provided whose endtime is earlier than current time and is accepted
        var user = Meteor.users.findOne({_id:userId});
        var offerId = user.profile.current_offer_id;
        var acEndTime = user.profile.ac_end_time;
        var tokensEarned = offers.findOne({_id: offerId}).tokensOffered;
        var status = user.profile.current_offer_state;
        // If offer status has been updated to success
        if (acEndTime <= new Date().getTime() && status == 2) {
            // update user's offer status to success
            Meteor.users.update({_id:userId},{$set:{"profile.current_offer_state":3}});
            // increase tokens by tokens earned
            Meteor.users.update({_id:userId}, {$inc:{"profile.total_tokens":tokensEarned}});
            //push offerid to list of succeededOffers
            Meteor.users.update({_id:userId}, {$push:{"profile.past_offers": {"tokens": tokensEarned, "status": 1, "end_time": acEndTime}}});
        }
    },

    resetUserStates: function(userId) {
        Meteor.users.update({_id:userId},{$set:{"profile.current_offer_state":0, "profile.current_offer_id":0, "profile.ac_end_time":0}});
    },

    deviceExists: function(deviceId) {
        return devices.find({_id: '' + deviceId}).count() > 0;
    },
    deviceValid: function(deviceId) {
      // device already registered = 2
      // device not in database = 1
      // device in database, not registered (valid) = 0
      if (devices.find({_id: '' + deviceId}).count() > 0) {
        if (devices.find({_id: '' + deviceId}).fetch()[0].status == 0) {
          // found device, unregistered
          return 0
        }
        else {
          // found device, but already registered
          return 2
        }
      }
      else {
        // did not find device in database
        return 1
      }
    }
});
