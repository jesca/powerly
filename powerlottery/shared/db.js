devices = new Mongo.Collection('devices');

if (Meteor.isServer) {
  Meteor.startup(function () {
    // clear the devices db on startup
    Meteor.users.remove({});
    devices.remove({});
    //for testing remove this line after done
    devices.insert({_id:"2",email:"none",status:0});

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
            devices.update({_id: id}, {$set: {status:1, uid: Meteor.userId()}});
            return;
        }
    });
  });

  //note Accounts automatically publishes user data if logged in
    
  Meteor.publish("userDevices", function (device) {
      console.log("published");
      if (this.userId) {
          console.log(devices.find().fetch());
          return devices.find({uid:this.userId});
        //return devices.find({_id:device}).fetch();
      }
  });
}

if (Meteor.isClient) {
  Meteor.subscribe("userData");
  Meteor.subscribe("userDevices", Meteor.user());
  console.log("subscribed");
}
