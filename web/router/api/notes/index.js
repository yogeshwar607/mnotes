const createNotes = require('./create.handler');
const getNotes = require('./get.handler');
const deleteNotes = require('./delete.handler');

module.exports = (router) => {
    router.post('/notes/create', createNotes);
    router.get('/notes/delete/:id', deleteNotes);
    router.get('/notes/get', getNotes);
};