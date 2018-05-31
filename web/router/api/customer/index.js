const createUser = require('./create.handler');
const  addUserInfo = require('./addUserInfo.handler');
const updateUser = require('./update.handler');
const getUser = require('./get.handler');
const changePass = require('./changePass.handler');
const signup = require('./signup.handler');
const updateType = require('./updateType.handler');
const otpSendAndVerify = require('./otpSendAndVerify.handler');
const blockAccount = require('./blockAccount.handler');
const blockTransaction = require('./blockTransaction.handler');


module.exports = (router) => {
    router.get('/customer/get', getUser);
    router.post('/customer/create', createUser);
    router.post('/customer/create/info', addUserInfo);
    router.post('/customer/update', updateUser);
    router.post('/customer/changepass', changePass);
    router.post('/customer/signup', signup);
    router.post('/customer/updatetype', updateType);
    router.get('/customer/otp/send', otpSendAndVerify);
    router.get('/customer/otp/verify', otpSendAndVerify);
    router.post('/customer/block/account', blockAccount);
    router.post('/customer/block/transaction', blockTransaction);
};