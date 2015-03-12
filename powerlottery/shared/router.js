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
