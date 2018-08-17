const createFolders = require('./create.handler');
const deleteFolders = require('./delete.handler');

module.exports = (router) => {
    router.post('/folders/create', createFolders);
    router.get('/folders/delete/:id', deleteFolders);
};