const createPayee = require('./create.handler');
const deletePayee = require('./delete.handler');
const getPayee = require('./get.handler');
const getPaginatedPayees = require('./pagination.handler');

module.exports = (router) => {
    router.get('/payee/get', getPayee);
    router.get('/payee/pagination',getPaginatedPayees);
    router.post('/payee/create', createPayee);
    router.post('/payee/delete', deletePayee);

};