const {sendMail} = require('./sendGrid.service');
const twilio = require('./twilioSMS.service');

module.exports = {

  sendMail,
  twilio,
};
