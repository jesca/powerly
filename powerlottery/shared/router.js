Router.configure({
  layoutTemplate:"layout"
});

Router.map(function() {
  this.route('main', {path: '/'});
  this.route('time');
  this.route('login', {layoutTemplate: 'login'});
  this.route('settings');
  this.route('userAccounts');
  this.route('rewards', {path: '/rewards'});
  this.route('data', {path: '/data'});
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
