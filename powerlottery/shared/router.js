Router.onBeforeAction(function () {
  // all properties available in the route function
  // are also available here such as this.params
  var routeName = this.route.getName();
  console.log("route name" + this.route.getName());
  if (!Meteor.user()) {
    console.log("not logged in");
    if (_.include(['userAccounts'], routeName)){
        this.next();
        return;
      }
    // if the user is not logged in, render the Login template
    this.render('login');
  } else {
    // otherwise don't hold up the rest of hooks or our route/action function
    // from running
    this.next();
  }
});

Router.configure({
  layoutTemplate:"layout"
});

Router.map(function() {
  this.route('main', {path: '/'});
  this.route('time');
  this.route('login', {layoutTemplate: 'login'});
  this.route('settings');
  this.route('userAccounts');
  this.route('rewards', {path: '/rewards', layoutTemplate: 'rewards'});
  this.route('data', {path: '/data', layoutTemplate: 'data'});
  this.route('hiscores', {path: '/hiscores', layoutTemplate: 'hiscores'});
});

// POST request for recieving device data
Router.route('/device', { where: 'server' })
  .post(function() {
    query = this.params.query;
    if (query.hasOwnProperty('id') &&
        query.hasOwnProperty('timestamp') &&
        query.hasOwnProperty('status') &&
        query.hasOwnProperty('power')) {
      console.log("Processing device request: " + JSON.stringify(query));
      PowerHandler.processDeviceUpdate(
        query['id'],
        query['timestamp'],
        query['status'],
        query['power']);
      this.response.end("success");
      return;
    }
    this.response.end("fail");
  })
