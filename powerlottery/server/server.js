Accounts.onCreateUser(function(options, user) {
    if (options.profile) {
    user.profile = options.profile;
    }
    user.profile.total_tokens = 0;
    user.profile.completed_offer_ids = [];
    user.profile.failed_offer_ids = [];
    user.profile.current_offer_id = "";
    user.profile.current_offer_state = 0
    return user;
});

Meteor.methods({
    getCurrentTime: function() {
        // return time in milliseconds 
        return new Date().getTime();
    },

    /*
        If there is no current offer, create the new offer!
        the client side will listen for the new offer in the offer table
        and update the UI and try to get the user to accept it
    */
    attemptCreateAndSendOffer: function() {
        if (!offers.find({_id: { $gte: new Date().getTime() }}).fetch().length == 0) {
            var offerLength = 60 * 10 * 1000;
            var endTime = new Date().getTime() + offerLength;
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
        var challengeLength = 1000 * 60 * 60;
        var offerEnd = new Date.getTime() + challengeLength;
        Meteor.users.update({_id: userId}, {$set: {"profile.current_offer_state": 2, "profile.current_offer_id": offerEnd}});
    },

    /*
        Updates the offer, this method will be polled by the client

        if the time is up, adds to the succeeded offers and awards tokens
        else, add to the failed offers
    */
    updateOutstandingOffer: function(userId) {
        // Updates user with userId provided whose endtime is earlier than current time and is accepted
        var user = Meteor.users.findOne({_id:UserId});
        var offerId = user.profile.current_offer_id;
        var tokensEarned = offers.findOne({_id: offerId}).tokensOffered;
        var status = user.profile.current_offer_state;
        // If offer status has been updated to success
        if (offerId <= new Date().getTime() && status == 2) {
            // update user's offer status to success
            Meteor.users.update({_id:userId},{$set:{"profile.current_offer_state":3}});
            // increase tokens by tokens earned
            Meteor.users.update({_id:userId}, {$inc:{"profile.total_tokens":tokensEarned}});
            //push offerid to list of succeededOffers
            Meteor.users.update({_id:userId}, {$push:{"profile.completed_offer_ids":id}});
        }
    },

    clearCurOffer: function(uid) {
          // sets current offer id = "", the offer has expired
          users.update({_id:uid},{$set: {"profile.current_offer_id": ""}});
    },
});
