if (Meteor.isServer) {

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

}
