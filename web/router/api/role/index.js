const createUser = require('./create.handler');
const deleteUser = require('./delete.handler');
const updateUser = require('./update.handler');
const getUser = require('./get.handler');


module.exports = (router) => {
    router.get('/admin/role/get', getUser);
    router.post('/admin/role/create', createUser);
    router.post('/admin/role/update', updateUser);
    router.post('/admin/role/delete', deleteUser);
};