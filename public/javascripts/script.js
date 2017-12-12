$(document).ready(function () {

    /* Login & Signup Toggle */

    var cardToggle = 0;
    $('.toggle-link').on('click', function (event) {
        event.preventDefault();
        if (cardToggle == 0) {
            $(this).text('Login');
            $('.login-box').animate({
                right: '350px'
            });
            $('.signup-box').animate({
                right: '0'
            });
            cardToggle = 1;

        } else {
            $(this).text('Signup');
            $('.login-box').animate({
                right: '0'
            });
            $('.signup-box').animate({
                right: '-350px'
            });
            cardToggle = 0;
        }
    });



    $("#btn_login").click(function () {
        let email = $("#login_email").val();
        if (email != null && email != '') {
            let password = $("#login_password").val();
            if (password != null && password != '') {
                // Temos que fazer uma chamada REST para verificar o login.
                let data = {
                    email,
                    password
                }
                
                usertInteract(false);
                xhrPost('/login', data, function (data) {
                    setSession('user', data.user);
                    window.location.href = '/home';
                }, function (err) {
                    console.log(err);
                    
                    deleteSession('user');
                    usertInteract(true);
                    console.log(err.error_reason);
                    alert(getMessage(err.error_reason));
                })
            } else {
                alert('Password required!');
            }



        } else {
            alert('Invalid email.')
        }

    })


    $("#btn_signup").click(function () {

        let name = $("#name").val();
        if (name != null && name != '') {

            let email = $("#signup_email").val();
            if (email != null && email != '') {

                let password = $("#signup_password").val();
                let confirm_password = $("#signup_confirm_password").val();
                if (password != null && confirm_password != null && password != '' && password == confirm_password) {

                    let data = {
                        name,
                        email,
                        password
                    }
                    usertInteract(false);
                    xhrPost('/signup', data, function (data) {
                        setSession('user', data.user);
                        window.location.href = '/home';
                    }, function (err) {
                        usertInteract(true);
                        alert(getMessage(err.error_reason));
                    })



                } else {
                    alert('Invalid password');
                }
            } else {
                alert('Email required');
            }
        } else {
            alert('Name required');
        }


    })
});