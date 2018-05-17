const createUser = require('./create.handler');
const  addUserInfo = require('./addUserInfo.handler');
const updateUser = require('./update.handler');
const getUser = require('./get.handler');
const changePass = require('./changePass.handler');
const signup = require('./signup.handler');
const updateType = require('./updateType.handler');
const otpVerification = require('./otpVerification.handler');
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
    router.post('/customer/otp/send', otpVerification);
    router.post('/customer/block/account', blockAccount);
    router.post('/customer/block/transaction', blockTransaction);

};