const update = require('./update.handler');
const get = require('./get.handler');

module.exports = (router) => {
    router.get('/customer/detail/get', get);
    router.get('/customer/detail/getById/:regi_id', get);
    router.post('/customer/detail/update', update);
};