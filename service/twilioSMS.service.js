const nconf = require('nconf');
const twilioVars = nconf.get('TWILIO')
const client = require('twilio')(twilioVars.accountSid, twilioVars.authToken);

function sendSMS({
    body,
    toMobileNo
}) {
    return new Promise((resolve, reject) => {
        
        if(!body) reject({'msg':'Please provide message body'});
        if(!toMobileNo) reject({'msg':'Please provide destination mobile number'});

        client.messages
            .create({
                body: body,
                from: twilioVars.fromMobileNo,
                to: toMobileNo
            })
            .then((message) => {
                resolve(message);
            })
            .catch((error)=>{
                reject(error);
            })
            .done();
    })
}

module.exports = {
    sendSMS,
}