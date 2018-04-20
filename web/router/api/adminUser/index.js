const createUser = require('./create.handler');
const deleteUser = require('./delete.handler');
const updateUser = require('./update.handler');
const getUser = require('./get.handler');


module.exports = (router) => {
    router.get('/admin/user/get', getUser);
    router.get('/admin/user/getUserByEmail/:email', getUser);
    router.get('/admin/user/getUserByRole/:role_id', getUser);
    router.post('/admin/user/create', createUser);
    router.post('/admin/user/update', updateUser);
    router.post('/admin/user/delete', deleteUser);
};