const reutersRate = require('./reutersRate.handler');

/**
 * Mounts component specific routes,
 * along with there respective route handlers
 * @param {object} router
 */
module.exports = (router) => {
  router.get('/reutersRate', reutersRate);
};