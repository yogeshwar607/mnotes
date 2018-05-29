const truliooCheck = require('./truliooCheck.service');
const reutersRate = require('./reutersRate.service');
const sendMail = require('./sendGrid.service');

module.exports = {
  truliooCheck,
  reutersRate,
  sendMail,
};
