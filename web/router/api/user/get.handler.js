const co = require('co');

const { userDAO } = rootRequire('commons').DAO;
const { ValidationError } = rootRequire('commons').ERROR;
// const assert = require('assert');

function* logic({ context, params }) {
  try {
    const _userDAO = userDAO();
    const id = params.id;
    const populateQuery = { path: 'roles client client_access' };
    const selectQuery = {};
    const baseQuery = {};
    baseQuery.client = { $in: context.clientAccessIds };
    baseQuery._id = id;
    const user = yield _userDAO.findOne({ baseQuery, selectQuery, populateQuery });
    if (!user) throw new ValidationError('User does not exist');
    return user;
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