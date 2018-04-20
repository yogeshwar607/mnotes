const create = require('./create.handler');
const update = require('./update.handler');
const get = require('./get.handler');
const delet = require('./delete.handler');

module.exports = (router) => {
    router.get('/customer/doc/get', get);
    router.post('/customer/doc/create', create);
    router.post('/customer/doc/update', update);
    router.post('/customer/doc/delete', delet);

};