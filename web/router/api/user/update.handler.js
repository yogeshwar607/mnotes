const co = require('co');
const Joi = require('joi');

const { userJoiSchema } = rootRequire('commons').SCHEMA;
const { ValidationError } = rootRequire('commons').ERROR;

const { userDAO } = rootRequire('commons').DAO;
// const assert = require('assert');
function enrichUserObj(body, context) {
  return {
    client: context.clientId,
    name: body.name,
    email: body.email,
    language: body.language,
    password: body.password,
    roles: body.roles,
    is_active: body.is_active,
    created_by: context.user.id,
    is_instarem_user: body.is_instarem_user,
    client_access: body.client_access ? body.client_access : [context.clientId],
  };
}

function* logic({ body, context, params }) {
  try {
    const _userDAO = userDAO();
    const id = params.id;
    const userObj = enrichUserObj(body, context);
    const { error } = Joi.validate(userObj, userJoiSchema);
    if (error) throw new ValidationError(`User Validation Error : ${error.message}`);
    const baseQuery = {};
    baseQuery._id = id;
    const user = yield _userDAO.findOne({ baseQuery });
    if (!user) throw new ValidationError('User does not exist exists');
    // Need to push the previous entry before update
    user.logs.push({ previous: user.toJSON() });
    Object.keys(userObj).forEach((key) => {
      user[key] = userObj[key];
    });
    return yield user.save();
  } catch (e) {
    logger.error(e);
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