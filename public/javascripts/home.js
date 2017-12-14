let context = {
    user: getSession('user')
};
let params = {},
watson = 'Watson';

function typeWriter(text, i, callback) {
    if (i < (text.length)) {
        document.querySelector("h4").innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true" id="caret"></span>';
        setTimeout(function () {
            typeWriter(text, i + 1, callback)
        }, 50);
    } else {
        callback();
    }

}

function StartTextAnimation(text) {
    $('#gif-holder').removeClass('hide');
    typeWriter(text, 0, function () {
        $('#gif-holder').addClass('hide');
    });

}




function userMessage(message) {

    params.input = {text: message};
    if (context) {
        params.context = context;
    }
    xhrPost('/conversation', params, function (response) {
        text = response.output.text;
        context = response.context;
        for (var txt in text) {
            if (text.length > 1 && txt >= 1) {
                setTimeout(function () {
                    displayMessage(text[txt], watson);
                }, text[txt].length * 60);
            } else {
                displayMessage(text[txt], watson);
            }


        }
    }, function (err) {

        displayMessage('Um erro ocorreu, tente mais tarde', watson);
    });
};


function newEvent(event) {
    // Only check for a return/enter press - Event 13
    if (event.which === 13 || event.keyCode === 13) {
        var userInput = document.getElementById('chatInput');
        text = userInput.value; 
        text = text.replace(/(\r\n|\n|\r)/gm, ""); 
        if (text) {
            userInput.value = '';
            userMessage(text);
        } else {
            userInput.value = '';
            return false;
        }
    }
}

function displayMessage(text, user) {
    StartTextAnimation(text.trim());
}

userMessage(' ');