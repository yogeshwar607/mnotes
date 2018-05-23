const router = require('express').Router();

const { requestLogger, authorization } = require('../middleware');

requestLogger(router);

// open components
// require('./api/authentication')(router);
require('./api/noAuth')(router);

 //  authorization(router);

// secured components

require('./api/user')(router);
require('./api/adminUser')(router);
require('./api/role')(router);
require('./api/role_map')(router);
require('./api/customer')(router);
require('./api/individualDocDetail')(router);
require('./api/individualUserDetail')(router);
require('./api/finalVerification')(router);
require('./api/initialVerification')(router);
require('./api/userDataVerification')(router);
require('./api/profile')(router);
require('./api/payee')(router);
require('./api/transaction')(router);
require('./api/rates')(router);


/**
 * Mounting respective paths.
 * @param {object} app Express instance
 */
module.exports = function(app) {
    app.use('/api/v1', router);
};