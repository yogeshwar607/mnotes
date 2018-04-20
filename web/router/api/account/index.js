const getAccounts = require('./getAccounts.handler');
const postAccounts = require('./postAccounts.handler');

/**
 * Mounts component specific routes,
 * along with there respective route handlers
 * @param {object} router
 */
module.exports = (router) => {
  router.get('/account', getAccounts);
  router.post('/account', postAccounts);
};