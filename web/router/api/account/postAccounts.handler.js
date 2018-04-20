const co = require('co');
const Joi = require('joi');

const { accountJoiSchema } = rootRequire('commons').SCHEMA;
const { ValidationError } = rootRequire('commons').ERROR;
const { accountDAO } = rootRequire('commons').DAO;
// const assert = require('assert');

// getters
function enrichAccountObj(body, context) {
  return {
    client: context.clientId,
    account_number: body.account_number,
    currency: body.currency,
    label: body.label,
    is_active: body.is_active,
    created_by: context.user.id,
  };
}

function* logic({ body, context }) {
  try {
    // saving client
    const accountObj = enrichAccountObj(body, context);
    const { error } = Joi.validate(accountObj, accountJoiSchema);

    if (error) throw new ValidationError(`Account Validation Error : ${error.message}`);
    return yield accountDAO().save(accountObj);
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