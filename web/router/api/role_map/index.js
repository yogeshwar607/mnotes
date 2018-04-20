const createUser = require('./create.handler');
const deleteUser = require('./delete.handler');
const updateUser = require('./update.handler');
const getUser = require('./get.handler');


module.exports = (router) => {
    router.get('/admin/role_map/get', getUser);
    router.post('/admin/role_map/create', createUser);
    router.post('/admin/role_map/update', updateUser);
    router.post('/admin/role_map/delete', deleteUser);
};