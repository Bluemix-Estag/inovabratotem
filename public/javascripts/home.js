// let chatDiv = document.createElement('div');
// chatDiv.setAttribute('id', 'chatHandler');
// chatDiv.innerHTML = '<div class="chat_header">'+
//                         '<span class="title">Chat With Watson</span>'+
//                         '<a href="javascript:closeChat();" class="close_btn">'+
//                             '<svg width="20" height="18" viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg">'+
//                                 '<path d="M1 0l17.678 17.678M1 17.678L18.678 0" stroke="#FFF" fill="none" stroke-linecap="square"/>'+
//                             '</svg>'+
//                         '</a>'+
//                     '</div>';
// $(document.body).append(chatDiv);




let context={
    user: getSession('user')
};
let chatIsOpen = false;


function closeChat() {
    chatIsOpen = false;
    $("#chatHandler").css({
        'animation-name': 'closeChat'
    })

    if($(document.body).width() <= 600 ){
        $(document.body).css({
            'overflow':'scroll',
            'position': 'static'
        })
    }

    $("#closeDiv").remove();
}


function chatToggle() {
    chatIsOpen = true;
    
    $("#chatHandler").css({
        'animation-name': 'showChat'
    })

    if($(document.body).width() <= 600 ){
        $(document.body).css({
            'overflow':'hidden',
            'position': 'fixed'
        })
    }

    let closeDiv = document.createElement('div');
    closeDiv.setAttribute("id", "closeDiv");
    closeDiv.setAttribute('onclick', 'closeChat()');
    $(document.body).append(closeDiv);

}

$(window).resize(function(){
    if(chatIsOpen){
        if($(document.body).width() <= 600 ){
            $(document.body).css({
                'overflow':'hidden',
                'position': 'fixed'
            })
        }else{
            $(document.body).css({
                'overflow':'scroll',
                'position': 'static'
            })

        }
    }
   

})

$("#send_btn").click(function(){ sendMessage()})

function sendMessageOnEnter(event){
    if(event.keyCode == 13){
        sendMessage();
    }
}


function sendMessage(){
        let message = $("#chat_input").val().trim();
        if(message != ''){

            $("#chat_input").val('');
            displayMessage(message,false);
            userMessage(message);
        }
    
}

function displayMessage(message, watson){
    
    let divClass = watson?'watson':'user';
    let bubble = '<div class="bubble '+divClass+'">'+message+'</div>';
    $("#chat_body").append(bubble);
    $('#chat_body').animate({scrollTop: $('#chat_body').prop("scrollHeight")}, 500);


}


function userMessage(message){

    let params = {
        input: {
            text: message || ' '
        },
        context: context
    };
 
    xhrPost('/conversation', params, function(data){

        console.log(JSON.stringify(data,null,2));

        let texts =  data.output.text;

        for(let text in texts){
            displayMessage(texts[text], true);
        }

        context = data.context;

    }, function(err){

        displayMessage('Um erro ocorreu, tente mais tarde', true);
    });

}


userMessage(' ');