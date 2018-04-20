const co = require('co');

const { reutersRate } = rootRequire('service');
// const assert = require('assert');

function* logic({ query }) {
  try {
    return yield reutersRate(query);
  } catch (e) {
    throw e;
  }
}

function handler(req, res, next) {
  co(logic(req))
    .then((data) => {
      res.json({
        success: true,
        data,
      });
    })
    .catch(err => next(err));
}
module.exports = handler;