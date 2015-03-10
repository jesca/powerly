Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
  this.render('layout');
});

Router.route('/time', function () {
  this.render('timeDisplay');
});

Router.route('/settings', function () {
  this.render('accountSettings');
});
