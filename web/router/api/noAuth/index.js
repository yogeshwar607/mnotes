const emailVerify = require('./emailVerification.handler');
const loginCust = require('./login.customer.handler');
const loginAdmin = require('./login.admin.handler');
const fxRate = require('./getFxRate.handler');


module.exports = (router) => {
    router.get('/email/verify/:id', emailVerify);
    router.post('/customer/login', loginCust);
    router.post('/admin/login', loginAdmin);
    router.post('/fxRate', fxRate);

};