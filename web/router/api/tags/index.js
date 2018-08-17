const createTags = require('./create.handler');

module.exports = (router) => {
    router.post('/folders/create', createTags);
};