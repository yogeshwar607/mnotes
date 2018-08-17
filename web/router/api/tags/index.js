const createTags = require('./create.handler');
const getTags = require('./get.handler');

module.exports = (router) => {
    router.post('/folders/create', createTags);
    router.get('/tags/get', getTags);
};