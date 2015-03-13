Router.onBeforeAction(function() {
  if (! Meteor.userId()) {
    this.render('login');
  } else {
    this.render('main');
  }
});

Router.map(function() {
  this.route('main', {path: '/'});
});
Router.map(function() {
  this.route('settings');
});
