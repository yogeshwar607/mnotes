const get = require('./get.handler');
const verification = require('./verification.handler');

module.exports = (router) => {
    router.get('/admin/userDataVerification/get', get);
    router.post('/admin/userDataVerification/verification', verification);
};