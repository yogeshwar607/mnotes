const create = require('./create.handler');
const update = require('./update.handler');
const getAllDoc = require('./get.allDoc.handler');
const getDoc = require('./get.handler.js');
const deleteDoc = require('./delete.handler');


module.exports = (router) => {
    router.get('/doc/get/all/:id', getAllDoc);
    router.get('/doc/get/:id', getDoc);
    router.post('/doc/create',create);
    router.post('/doc/update', update);
    router.post('/doc/delete', deleteDoc);
};