const rates = require('./rates');

module.exports = (router) => {
    router.post('/rates', rates);
};