const get = require('./get.handler');
const verification = require('./verification.handler');

module.exports = (router) => {
    router.get('/admin/finalVerification/get', get);
    router.post('/admin/finalVerification/verification', verification);
};