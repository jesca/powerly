/*
 * This algorithm assumes devices are in the same timezone 
 * 
 * This implementation will probably fail under extremely 
 * heavy loads by the way, but should be fine for our purposes.
 * 
 */
PowerHandler = {
  windowSize: 5000,
  windowPowerTotal: 0,
  maxPowerThreshold: 1000,
  Vrms: 120,
  minheap: new Heap(),
  
  init: function() {
    Meteor.setInterval(PowerHandler.updateTotalPowerUsage, PowerHandler.windowSize);
  },
  
  /*
   * Processes a post request from a device
   * Gets called asynchronously
   */
  processDeviceUpdate: function(deviceId, timestamp, status, power) {
    if (devices.findOne({ _id: deviceId })) {
      devices.update({ 
          _id: deviceId + ''
        }, { 
          _id: deviceId + '',
          timestamp: timestamp, 
          status: status, 
          power: power
        }, function(error, result) {});
    }
    else {
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

    var powerUsage = power * PowerHandler.Vrms;
    var user = Meteor.users.findOne({'profile.device_id' : deviceId + '' });
    if (user) {
      if (user['profile']['current_offer_state'] == 2 && status == 1) {
        Meteor.users.update({_id: user['_id']}, {$push:{"profile.failed_offer_ids":user.profile.current_offer_id}});
        Meteor.users.update({_id: user['_id']},{$set:{"profile.current_offer_state":4}});
      }
      // status 1 - on
      Meteor.users.update({_id: user['_id']},{$set:{"profile.status": status}});
      Meteor.users.update({_id: user['_id']},{$inc:{"profile.power_usage": powerUsage}});

      PowerHandler.windowPowerTotal += powerUsage;
      PowerHandler.minheap.push({user: user['_id'], time: timestamp, value: powerUsage});
      PowerHandler.updateTotalPowerUsage();
    }
  },
  
  updateTotalPowerUsage: function() {
    console.log("Total current power usage: " + PowerHandler.windowPowerTotal);
    if (PowerHandler.minheap.empty()) {
      return; 
    }
    var timeVal = PowerHandler.minheap.peek();
    while (timeVal.time < new Date().getTime() - PowerHandler.windowSize) {
      PowerHandler.windowPowerTotal -= timeVal.value;
      var obj = PowerHandler.minheap.pop();
      Meteor.users.update({_id: obj.user},{$inc:{"profile.power_usage": -1 * obj.value}});
      var power_usage = Meteor.users.findOne({_id: obj.user}).profile.power_usage;
      if (power_usage == 0) {
        Meteor.users.update({_id: obj.user},{$set:{"profile.status": 0}});
      }
      if (PowerHandler.minheap.empty()) {
        break;
      }
      timeVal = PowerHandler.minheap.peek();
    }
    
    if (this.windowPowerTotal > PowerHandler.maxPowerThreshold) {
      // send offer to users here
      Meteor.call('attemptCreateAndSendOffer');
    }
  }
};

PowerHandler.init();

