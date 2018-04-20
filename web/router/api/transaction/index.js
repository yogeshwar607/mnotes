const createTransaction = require('./create.handler');
const cancelTransaction = require('./cancel.handler');
const getTransaction = require('./get.handler');

module.exports = (router) => {
    router.get('/transaction/get', getTransaction);
    router.get('/transaction/getPendingTransaction/:vis_pending', getTransaction);
    router.get('/transaction/getCancelledTransaction/:vis_cancelled', getTransaction);
    router.get('/transaction/getCompletedTransaction/:vis_completed', getTransaction);
    router.post('/transaction/create', createTransaction);
    router.post('/transaction/cancel', cancelTransaction);
};