Router.route('/', function () {
  this.render('main');
});

Router.route('/time', function () {
  this.render('timeDisplay');
});
