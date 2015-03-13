Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', function () {
  this.render('main');
});

Router.route('/time', function () {
  this.render('timeDisplay');
});

Router.route('/settings', function () {
  this.render('accountSettings');
});

// POST request for recieving device data
Router.route('/device', { where: 'server' })
  .post(function() {
    query = this.params.query;
    PowerHandler.processDeviceUpdate(
      query['id'], 
      query['timestamp'], 
      query['status'], 
      query['power']);
    this.response.end(JSON.stringify(this.params.query));
  })
