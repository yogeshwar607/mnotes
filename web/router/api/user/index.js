// const bulkGetHandler = require('./bulkGet.handler');
const createHandler = require('./create.handler');
const paginationHandler = require('./pagination.handler');
const getHandler = require('./get.handler');
const updateHandler = require('./update.handler');
/**
 * Mounts component specific routes,
 * along with there respective route handlers
 * @param {object} router
 */
module.exports = (router) => {
    // router.get('/user', bulkGetHandler);
    // router.post('/user/update/:id', updateHandler);
    // router.get('/user/pagination', paginationHandler);
    // router.get('/user/:id', getHandler);
    router.post('/user/create/:s', createHandler);
};