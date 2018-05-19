const createPayee = require('./create.handler');
const updatePayee = require('./update.handler');
const getPayee = require('./get.handler');
const getPaginatedPayees = require('./pagination.handler');

module.exports = (router) => {
    router.get('/payee/get/:id', getPayee);
    router.get('/payee/pagination',getPaginatedPayees);
    router.post('/payee/create', createPayee);
    router.post('/payee/delete', updatePayee);
};