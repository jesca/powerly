devices = new Mongo.Collection('devices');
offers = new Mongo.Collection('offers');

if (Meteor.isServer) {
  Meteor.startup(function () {
    // clear the devices and offers db on startup
    //sMeteor.users.remove({});
    offers.remove({});
    devices.remove({});
    Meteor.users.update({}, {$set:{'profile.status': 0, 'profile.power_usage': 0}});
    //for testing remove this line after done
    devices.insert({_id:"2",email:"none",status:0});

    //offers.insert({ _id: offerId, tokensOffered: 10});
    //db.users.update({ _id: 'zhAcKfAuRGy7o9hAM'}, {$set:{profile: {current_offer_id: offerId, current_offer_state: 1}}});
  });

  Meteor.methods({
        realdeviceid: function (id) {
            device = devices.find({_id: id});
            console.log(device.count());
            return device.count();
        },
        isAvail: function(id) {
            device = devices.find({_id: id}).fetch();
            return device[0].status;
        },
        addUsertoDevice: function(id, uid) {
            devices.update({_id: id}, {$set: {status:1}});
            return;
        },
        getOfferDetails: function(offer_id, uid) {
          var offerDetails =  offers.find({_id:offer_id}).fetch();

          var offer_start_time = offerDetails['timestamp'];
          var offer_expiration = new Date(new Date().getTime() + total_offer_min*60000);

          if (new Date() >= offer_expiration) {
            // user has successfully completed offer, clear user's offer and add to user's list of completed offers
            clearCurOffer(uid);
            updateSuccessfulOffer(uid,offer_id);
            return false;
          }

          else {
            return offerDetails;
          }
        },
        updateSuccessfulOffer: function(uid,offer_id) {
          users.update({_id:uid}, { $push: { completed_offer_ids: offer_id } });
          return;
        }
    });

  // TODO: change this to a method that checks if the current id is already in devices (used by registration check)
  Meteor.publish("devices", function () {
    return devices.find();
  });

  Meteor.publish("offers", function () {
    return offers.find();
  });

  Meteor.publish("userDevices", function (device) {
      if (this.userId) {
          console.log(devices.find().fetch());
          return devices.find({uid:this.userId});
        //return devices.find({_id:device}).fetch();
      }
  });
}

if (Meteor.isClient) {
  Meteor.subscribe("userDevices", Meteor.user());
  Meteor.subscribe("devices");
  Meteor.subscribe("offers");
}
