/*
 * This algorithm assumes devices are in the same timezone 
 * and comply with a Vrms of 120
 */
var windowSize = 5000;
var windowPowerTotal = 0;
var Vrms = 120;
var minheap = new Heap();

/*
 * Processes a post request from a device
 * Gets called asynchronously
 */
function processDeviceUpdate(deviceId, timestamp, status, power) {
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
  if (timestamp < new Date().getTime() - windowSize) {
    return;
  }
  windowPowerTotal += power * Vrms;
  minheap.push({time: timestamp, value: power * Vrms});
}

function updateTotalPowerUsage() {
  if (minheap.empty()) {
    return; 
  }
  
  var timeVal = minheap.peek();
  
  while (timeVal.time < new Date().getTime() - windowSize) {
    windowPowerTotal -= timeVal.value;
    minheap.pop();
    timeVal = minheap.peek();
  }
}

setInterval(updateTotalPowerUsage, 5000);
