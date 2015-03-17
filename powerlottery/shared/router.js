Router.configure({
  layoutTemplate:"layout"
});

Router.map(function() {
  this.route('main', {path: '/', layoutTemplate:'main'});
  this.route('settings');
  this.route('userAccounts');
});
