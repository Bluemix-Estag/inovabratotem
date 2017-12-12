
var request = require('request');

const sendMessage = (req,callback) => {



    const params = req.body;
    const authentication_key = new Buffer(`${process.env.CONVERSATION_USERNAME}:${process.env.CONVERSATION_PASSWORD}`).toString('base64');

    const options = {
        url: `https://gateway.watsonplatform.net/conversation/api/v1/workspaces/${process.env.WORKSPACE_ID}/message?version=2017-05-26`,
        method: 'POST',
        headers: {
            'Authorization': `Basic ${authentication_key}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    }

    console.log(`Params: ${JSON.stringify(params, null , 2)}`);

    request(options, (error, response, body) => {

        if (!error && response.statusCode == 200) {
            callback(null, JSON.parse(body))
        } else {
            callback({error: true }, null)
        }

    })

}


module.exports = {
    sendMessage
}