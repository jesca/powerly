
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
    negativeFeedback: false,
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

            d_id = "" + d_id + ""
            var findDevice = devices.find({_id: d_id}).count();
            if (findDevice == 0) {
              console.log("didn't find device");
              return true;
            }
            else if (findDevice > 0) {
                // get the current device info
                var register_info = devices.find({_id:d_id},{email: 1, status:1}).fetch();
                  if (register_info[0].status == 0) {
                    // unregistered valid device, continue
                    return false;
                  }
                  else {
                    return true;
                  }
                }
      },
      errStr: "This device does not exist or has already been registered!",

}]);
