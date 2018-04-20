const co = require('co');

const { userDAO } = rootRequire('commons').DAO;
// const assert = require('assert');

function* logic({ context, query }) {
  try {
    const _userDAO = userDAO();
    baseQuery.client = { $in: context.clientAccessIds };
    return yield _userDAO.find(baseQuery).populate({ path: 'roles client client_access' });
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