const Joi = require('joi');
const { PASSWORD_REGEX } = rootRequire('constants');

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required().regex(PASSWORD_REGEX),
});

module.exports = {
  loginSchema,
};