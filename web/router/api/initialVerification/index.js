const get = require('./get.handler');
const verification = require('./verification.handler');

module.exports = (router) => {
    router.get('/admin/initialVerification/get', get);
    router.post('/admin/initialVerification/verification', verification);
};