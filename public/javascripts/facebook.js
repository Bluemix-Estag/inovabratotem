 // This is called with the results from from FB.getLoginStatus().
 function statusChangeCallback(response) {
     console.log('statusChangeCallback');
     console.log(response);
     if (response.status === 'connected') {
         // Logged into your app and Facebook.
         testAPI();
     } else {


     }
 }

 function checkLoginState() {
     FB.getLoginStatus(function (response) {
         statusChangeCallback(response);
     });
 }

 window.fbAsyncInit = function () {
     FB.init({
         appId: '197503220824184',
         cookie: true,
         xfbml: true,
         version: 'v2.11'
     });

     FB.login(function (response) {
         console.log('FB.login');
         if (response.authResponse) {
             FB.api('/me', function (response) {
                 setSession('user', response);
                 window.location.href = '/home';
             });
         } else {
             console.log('User cancelled login or did not fully authorize.');
         }
     });

     FB.getLoginStatus(function (response) {
         statusChangeCallback(response);
     });

 };

 // Load the SDK asynchronously
 (function (d, s, id) {
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) return;
     js = d.createElement(s);
     js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

 // Here we run a very simple test of the Graph API after login is
 // successful.  See statusChangeCallback() for when this call is made.
 function testAPI() {
     console.log('Welcome!  Fetching your information.... ');
     FB.api('/me', function (response) {
         setSession('user', response);
         window.location.href = '/home';

     });
 }