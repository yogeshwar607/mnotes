const createUser = require('./create.handler');
const  addCustomerInfo = require('./addCustomerInfo.handler');
const updateUser = require('./update.handler');
const getUser = require('./get.handler');
const changePass = require('./changePass.handler');
const updateType = require('./updateType.handler');
const otpSendAndVerify = require('./otpSendAndVerify.handler');
const blockAccount = require('./blockAccount.handler');
const blockTransaction = require('./blockTransaction.handler');
const getPaginatedCustomers = require('./pagination.handler');
const getCustomerInfo = require('./getCustomerInfo.handler');

module.exports = (router) => {
    router.get('/customer/get', getUser);
    router.post('/customer/create', createUser);
    router.post('/customer/create/info', addCustomerInfo);
    router.post('/customer/update', updateUser);
    router.post('/customer/changepass', changePass);
    router.post('/customer/updatetype', updateType);
    router.get('/customer/otp/send', otpSendAndVerify);
    router.get('/customer/otp/verify', otpSendAndVerify);
    router.post('/customer/block/account', blockAccount);
    router.post('/customer/block/transaction', blockTransaction);
    router.post('/customer/pagination',getPaginatedCustomers);
    router.get('/customer/info/:id',getCustomerInfo);
};