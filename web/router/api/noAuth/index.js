const emailVerify = require('./emailVerification.handler');
const loginCust = require('./login.customer.handler');
const loginAdmin = require('./login.admin.handler');
const fxRate = require('./getFxRate.handler');
const forgotPassword = require('./forgetPassword.handler');
const resetPassword = require('./resetPassword.handler');
const createCustomer = require('./create.customer.handler');

module.exports = (router) => {
    router.get('/email/verify/:id', emailVerify);
    router.post('/customer/login', loginCust);
    router.post('/admin/login', loginAdmin);
    router.post('/fxRate', fxRate);
    router.post('/customer/create', createCustomer);
    router.put('/customer/password/forgot/:id',forgotPassword);
    router.post('/customer/password/reset',resetPassword);
};