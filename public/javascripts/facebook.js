//  window.fbAsyncInit = function () {
//      FB.init({
//          appId: '197503220824184',
//          status: true,
//          cookie: true,
//          xfbml: true,
//          oauth: true,
//          version: 'v2.11'
//      });

//      FB.login(function (response) {
//          console.log('FB.login');
//          if (response.authResponse) {
//              FB.api('/me', function (response) {
//                  //  setSession('user', response);
//                  //  window.location.href = '/home';
//              });
//          } else {
//              console.log('User cancelled login or did not fully authorize.');
//          }
//      }, { auth_type: 'reauthenticate'});



//  };





// In your JavaScript code:
var login_event = function (response) {
    console.log("login_event");
    FB.api('/me?fields=email,name','GET',
        function(response) {
            // Insert your code here
            console.log(JSON.stringify(response))
        }
      );
}

window.fbAsyncInit = function () {

    FB.init({
        appId: '197503220824184',
        status: false,
        cookie: false,
        xfbml: true,
        version: 'v2.11'
    });

    // Load the SDK asynchronously
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    
    FB.Event.subscribe('auth.authResponseChange', login_event) 

}