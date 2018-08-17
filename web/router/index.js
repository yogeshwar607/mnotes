const router = require('express').Router();

const { requestLogger, authorization ,routeGuard} = require('../middleware');

requestLogger(router);

// open components
// require('./api/authentication')(router);
//require('./api/noAuth')(router);

 //authorization(router);
 //routeGuard(router);
// secured components

require('./api/folders')(router);
require('./api/notes')(router);
require('./api/tags')(router);
require('./api/user')(router);



/**
 * Mounting respective paths.
 * @param {object} app Express instance
 */
module.exports = function(app) {
    app.use('/api/v1', router);
};