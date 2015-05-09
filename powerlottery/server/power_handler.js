/*
 * This algorithm assumes devices are in the same timezone
 *
 * This implementation will probably fail under extremely
 * heavy loads by the way, but should be fine for our purposes.
 *
 */
PowerHandler = {
  windowSize: 30000,
  windowPowerTotal: 0,
  maxPowerThreshold: 0,

  //Vrms: 120,
  minheap: new Heap(),
  latestUpdates: {},

  init: function() {
    Meteor.setInterval(PowerHandler.updateTotalPowerUsage, PowerHandler.windowSize);
  },

  /*
   * Processes a post request from a device
   * Gets called asynchronously
   */
  processDeviceUpdate: function(deviceId, timestamp, status, power) {
    if (devices.findOne({
        _id: deviceId
      })) {
      devices.update({
        _id: deviceId + ''
      }, {
        _id: deviceId + '',
        timestamp: timestamp,
        power: power
      }, function(error, result) {});
    } else {
      devices.insert({
        _id: deviceId + '',
        timestamp: timestamp,
        status: status,
        power: power
      }, function(error, result) {});
    }

    // reject timestamps outside of the current window
    if (timestamp < new Date().getTime() - PowerHandler.windowSize) {
      return;
    }

    var powerUsage = power;
    var user = Meteor.users.findOne({
      'profile.device_id': deviceId + ''
    });
    if (user) {
      Meteor.users.update({
        _id: user['_id']
      }, {
        $set: {
          "profile.status": status
        }
      });
      PowerHandler.windowPowerTotal -= user.profile.power_usage;
      PowerHandler.windowPowerTotal += powerUsage;
      PowerHandler.latestUpdates[user['_id']] = timestamp;
      Meteor.users.update({
        _id: user['_id']
      }, {
        $set: {
          "profile.power_usage": powerUsage
        }
      });
      PowerHandler.minheap.push({
        user: user['_id'],
        time: timestamp,
        value: powerUsage
      });
      if (user['profile']['current_offer_state'] == 2 && status == 1) {
        PowerHandler.failUserOffer(user);
      }
      PowerHandler.updateTotalPowerUsage();
    }
  },

  updateTotalPowerUsage: function() {
    console.log("Total current power usage: " + PowerHandler.windowPowerTotal);
    if (PowerHandler.minheap.empty()) {
      return;
    }
    var powerPacket = PowerHandler.minheap.peek();
    while (powerPacket.time < new Date().getTime() - PowerHandler.windowSize) {
      if (powerPacket.time == PowerHandler.latestUpdates[powerPacket.user]) {
        delete PowerHandler.latestUpdates[powerPacket.user];
        PowerHandler.windowPowerTotal -= powerPacket.value;
        Meteor.users.update({
          _id: powerPacket.user
        }, {
          $set: {
            "profile.power_usage": 0,
            "profile.status": 2
          }
        });
        var user = Meteor.users.findOne({
          '_id': powerPacket.user
        });
        if (user.profile.current_offer_state == 2) {
          PowerHandler.failUserOffer(user);
        }
      }
      PowerHandler.minheap.pop();
      if (PowerHandler.minheap.empty()) {
        break;
      }
      powerPacket = PowerHandler.minheap.peek();
    }

    if (this.windowPowerTotal > PowerHandler.maxPowerThreshold) {
      // send offer to users here
      Meteor.call('attemptCreateAndSendOffer');
    }
  },

  failUserOffer: function(user) {
    var acEndTime = user.profile.ac_end_time;
    var tokensEarned = offers.findOne({
      _id: user.profile.current_offer_id
    }, {
      tokensOffered: 1
    }).tokensOffered;
    Meteor.users.update({
      _id: user['_id']
    }, {
      $push: {
        "profile.past_offers": {
          "tokens": tokensEarned,
          "status": 0,
          "end_time": acEndTime
        }
      }
    });
    Meteor.users.update({
      _id: user['_id']
    }, {
      $set: {
        "profile.current_offer_state": 4
      }
    });
  }
};

PowerHandler.init();