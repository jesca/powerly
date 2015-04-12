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

OfferHandler = {
    tokenAmount: 10,
    // 10 minutes
    offerLength: 1000 * 60 * 10,

    attemptCreateAndSendOffer: function() {
        /*
            If there is no current offer, create the new offer!
            the client side will listen for the new offer in the offer table
            and update the UI and try to get the user to accept it
        */
        if (!offers.find({offerEnd: { $gte: new Date().getTime() }}).fetch().length == 0) {
            var endTime = new Date().getTime() + OfferHandler.offerLength;
            offers.insert({
                tokensOffered: OfferHandler.tokenAmount,
                timestamp: endTime
            }, function(error, result) {});
        }
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
    }
};