const Boom = require('boom');

function routeGuard(router) {
    router.use((req, res, next) => {
      //check for access
      if (false) {
        return next(Boom.unauthorized('no access privileges'));
      }
      return next();
    });
  }

module.exports = routeGuard