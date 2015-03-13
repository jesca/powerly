if (Meteor.isServer) {
  /*
   * This algorithm assumes devices are in the same timezone 
   * and comply with a Vrms of 120
   * 
   * This implementation will probably fail under extremely 
   * heavy loads by the way, but should be fine for our purposes.
   * 
   */
  function PowerHandler() {}

  /*
   * Processes a post request from a device
   * Gets called asynchronously
   */
  PowerHandler.processDeviceUpdate = function(deviceId, timestamp, status, power) {
    if (devices.findOne({ _id: deviceId })) {
      devices.update({ 
          _id: deviceId
        }, { 
          _id: deviceId, 
          timestamp: timestamp, 
          status: status, 
          power: power
        }, function(error, result) {});
    }
    else {
      devices.insert({ 
        _id: deviceId, 
        timestamp: timestamp, 
        status: status, 
        power: power
      }, function(error, result) {});
    }
    // reject timestamps outside of the current window
    if (timestamp < new Date().getTime() - PowerHandler.windowSize) {
      return;
    }
    PowerHandler.windowPowerTotal += power * Vrms;
    PowerHandler.minheap.push({time: timestamp, value: power * Vrms});
    
    PowerHandler.updateTotalPowerUsage();
  }

  PowerHandler.updateTotalPowerUsage = function() {
    if (PowerHandler.minheap.empty()) {
      return; 
    }
    var timeVal = PowerHandler.minheap.peek();
    
    while (timeVal.time < new Date().getTime() - PowerHandler.windowSize) {
      PowerHandler.windowPowerTotal -= timeVal.value;
      minheap.pop();
      timeVal = minheap.peek();
    }
    
    if (PowerHandler.windowPowerTotal > PowerHandler.maxPowerThreshold) {
      // send offer to users
    }
  }

  PowerHandler.windowSize = 10000;
  PowerHandler.windowPowerTotal = 0;
  PowerHandler.maxPowerThreshold = 1000;
  PowerHandler.Vrms = 120;
  PowerHandler.minheap = new Heap();
  setInterval(PowerHandler.updateTotalPowerUsage, PowerHandler.windowSize);
}
