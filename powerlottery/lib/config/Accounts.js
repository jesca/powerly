
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
        Meteor.call("deviceExists", d_id, function(err, deviceExists) {
            that.setValidating(false);
            if (!deviceExists)
                that.setSuccess();
            else {
                that.setError("This device does not exist or has already been registered!");
            }
        });
    },
  }
]);
