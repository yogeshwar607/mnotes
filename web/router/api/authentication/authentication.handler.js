const co = require('co');

const { userDAO } = rootRequire('commons').DAO;
const { AuthorizationError } = rootRequire('commons').ERROR;
const config = rootRequire('config').server;
const jwt = require('jsonwebtoken');
// const assert = require('assert');

function* logic({ body }) {
  try {
    const _userDAO = userDAO();
    const user = yield _userDAO.getUserPrivileges({ email: body.email });
    if (!user) {
      throw new AuthorizationError('Invalid emailId.');
    }
    const isMatch = yield user.comparePassword(body.password);
    if (!isMatch) {
      throw new AuthorizationError('Invalid emailId and Password.');
    }
    const payloads = {
      // token expiry period set for 1 month (Expiry to be set for 1 hour(60 * 60) in production)
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
      sub: user.id,
    };
    const token = jwt.sign(payloads, config.jwtSecret);
    return { token, user };
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