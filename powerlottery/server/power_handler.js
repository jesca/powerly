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
    setInterval(PowerHandler.updateTotalPowerUsage, PowerHandler.windowSize);
  },
  
  /*
   * Processes a post request from a device
   * Gets called asynchronously
   */
  processDeviceUpdate: function(deviceId, timestamp, status, power) {
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
    PowerHandler.windowPowerTotal += power * PowerHandler.Vrms;
    PowerHandler.minheap.push({time: timestamp, value: power * PowerHandler.Vrms});
    PowerHandler.updateTotalPowerUsage();
  },
  
  updateTotalPowerUsage: function() {
    console.log("Total current power usage: " + PowerHandler.windowPowerTotal);
    if (PowerHandler.minheap.empty()) {
      return; 
    }
    var timeVal = PowerHandler.minheap.peek();
    
    while (timeVal.time < new Date().getTime() - PowerHandler.windowSize) {
      PowerHandler.windowPowerTotal -= timeVal.value;
      PowerHandler.minheap.pop();
      if (PowerHandler.minheap.empty()) {
        break;
      }
      timeVal = PowerHandler.minheap.peek();
    }
    
    if (this.windowPowerTotal > PowerHandler.maxPowerThreshold) {
      // send offer to users here
    }
  }
};

PowerHandler.init();

