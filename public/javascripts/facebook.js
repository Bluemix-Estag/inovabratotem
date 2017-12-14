// In your JavaScript code:
var login_event = function (response) {
    console.log('Login event');
    if (response.status == 'connected') {

        FB.api('/me?fields=email,name', 'GET',
            function (response) {
                setSession('user', response);
                window.location.href = '/home';
            }
        );

    }
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


    FB.getLoginStatus(function (response) {
        console.log('Get login status')
        console.log(JSON.stringify(response));
    })

}