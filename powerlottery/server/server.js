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

    acceptOffer: function(offerId, userId) {
        /*
            This will be triggered originally from the client side if
            the user accepts the offer
        */
        // update userId with an endTime, and stick offerId in

    },

    updatePendingOffer: function(offerId, userId) {
    },

    /*
        Updates the offer, this method will be polled by the client

        if the time is up, adds to the succeeded offers and awards tokens
        else, add to the failed offers
    */
    updateOutstandingOffer: function(offerId, userId) {
    },


})
 