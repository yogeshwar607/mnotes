const createTransaction = require('./create.handler');
const cancelTransaction = require('./cancel.handler');
const getTransaction = require('./get.handler');
const getPaginatedTransactions = require('./pagination.handler');
const updateTransaction = require('./update.handler');
const txnCharge = require('./txnCharge.handler');

module.exports = (router) => {
    router.get('/transaction/get/:id', getTransaction);
    router.post('/transaction/create', createTransaction);
    router.post('/transaction/pagination',getPaginatedTransactions);
    router.post('/transaction/update/:id', updateTransaction);

    router.get('/transaction/getPendingTransaction/:vis_pending', getTransaction);
    router.get('/transaction/getCancelledTransaction/:vis_cancelled', getTransaction);
    router.get('/transaction/getCompletedTransaction/:vis_completed', getTransaction);
    router.post('/transaction/create', createTransaction);
    router.post('/transaction/cancel', cancelTransaction);
    router.post('/transaction/charge', txnCharge);
};