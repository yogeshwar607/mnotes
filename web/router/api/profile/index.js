const create2fa = require('./create2FA.handler');
const enable2fa = require('./enable2FA.handler');


module.exports = (router) => {
    router.post('/admin/create/2fa', create2fa);
    router.post('/admin/enable/2fa', enable2fa);

};