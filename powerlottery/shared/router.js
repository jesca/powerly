Router.configure({
  layoutTemplate:"layout"
});

Router.onBeforeAction(function() {
  if (! Meteor.userId()) {
    this.render('login');
  } else {
    this.next();
  }
});

Router.map(function() {
  this.route('main', {path: '/'});
  this.route('settings');
});
