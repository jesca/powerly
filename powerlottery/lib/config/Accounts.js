
var postSubmit = function(error, state){
  if (!error) {
    if (state === "signIn") {
      // Successfully logged in
      // ...
    }
    if (state === "signUp") {
      // Successfully registered
      // ...
    }
  }
  else {
    console.log(error);
  }
};

AccountsTemplates.configure({
   onSubmitHook: postSubmit,
    // Behaviour
    confirmPassword: false,
    enablePasswordChange: true,
    sendVerificationEmail: false,
    lowercaseUsername: false,

    // Appearance
    showForgotPasswordLink: true,
    showLabels: true,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: true,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Redirects
    homeRoutePath: 'main',
    redirectTimeout: 4000,
    // Texts
    texts: {
      button: {
          signUp: "Register"
      },
      title: {
          forgotPwd: "Recover Your Password",
          signIn: ""
      },
    },
});



AccountsTemplates.addFields( [
  {
    _id: "name",
    type: "text",
    displayName: "Username",
    required: true,
    },

  {
    _id: 'device_id',
    type: 'text',
    placeholder: {
        signUp: "Unique device id found on the back of your Powerly device"
    },
    required: true,
    displayName: "Device ID",
    func: function (d_id) {
        var that = this;
        Meteor.call("deviceValid", d_id, function(err, deviceValid) {
            that.setValidating(false);
            // device already registered = 2
            // device not in database = 1
            // device in database, not registered (valid) = 0
            if (deviceValid == 0) {
                that.setSuccess();
              }
            else if (deviceValid == 1){
                that.setError("This device does not exist");
            }
            else if (deviceValid == 2){
                that.setError("This device is already registered");
            }
        });
    },
  }
]);
