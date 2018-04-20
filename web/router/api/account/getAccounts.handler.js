const co = require('co');

const { accountDAO } = rootRequire('commons').DAO;
// const assert = require('assert');

function* logic({ context, query }) {
  try {
    const _accountDAO = accountDAO();
    const baseQuery = {};
    baseQuery.client = { $in: context.clientAccessIds };
    if (query.clientId) {
      baseQuery.client = context.clientId;
    }
    // const projectionQuery = { account_number: 1, currency: 1 };
    return yield _accountDAO.find({ baseQuery });
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