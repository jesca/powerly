Accounts.onCreateUser(function(options, user) {
    if (options.profile) {
    user.profile = options.profile;
    }
    user.profile.total_tokens = 0;
    user.profile.completed_offer_ids = [];
    user.profile.failed_offer_ids = [];
    user.profile.current_offer_id = "";
    return user;
});

Meteor.methods( {
    getCurrentTime: function() {
        // return time in milliseconds 
        return new Date().getTime()
    },

    /*
        If there is no current offer, create the new offer!
        the client side will listen for the new offer in the offer table
        and update the UI and try to get the user to accept it
    */
    attemptCreateAndSendOffer: function() {
        if (!offers.find({offerEnd: { $gte: new Date().getTime() }}).fetch().length == 0) {
            var offerLength = 60 * 10 * 1000;
            var endTime = new Date().getTime() + OfferHandler.offerLength;
            offers.insert({
                _id: endTime,
                tokensOffered: OfferHandler.tokenAmount
            }, function(error, result) {});

            /*
              Updates all users whose offer status is not accepted to pending and sets offerId to endtime
              offerStatus = 0 - none, 1 - pending, 2 - accepted, 3 - success, 4 - fai
            */
            
            Meteor.users.update({offerStatus: {$ne:2}}, {$set: {offerStatus:"1"}}, {multi:true});
            Meteor.users.update({offerStatus: {$ne:2}}, {$set: {offerId: endTime}}, {multi:true});
        }
    },

    /*
        This will be triggered originally from the client side if
        the user accepts the offer
        update userId with accepted when client side accepts offer
    */    
    acceptOffer: function(offerId, userId) {
        Meteor.users.update({userId: userId}, {$set: {offerStatus: 2}});
    },


    /*
        Updates the offer, this method will be polled by the client

        if the time is up, adds to the succeeded offers and awards tokens
        else, add to the failed offers
    */
    updateOutstandingOffer: function(offerId, userId) {
        
        // Updates user with userId provided whose endtime is earlier than current time and is accepted
        var user = Meteor.users.find({_id:UserId}).fetch()[0]
        var id = user.offerId;
        var tokensEarned = user.tokensOffered;
        var status =  user.offerStatus;
        // If offer status has been updated to success
        if (id <= new Date.getTime() && status == "2") {
            // update user's offer status to success
            Meteor.users.update({_id:userId},{$set:{offerStatus:"3"}});
            // increase tokens by tokens earned
            Meteor.users.update({_id:userId}, {$inc:{tokens:tokensEarned}});
            //push offerid to list of succeededOffers
            Meteor.users.update({_id:userId}, {$push:{succeededOffers:id}});           
        }                            
    },
})
 