const Joi = require('joi');

const payeeSchema = Joi.object().keys({
  id: Joi.string().required(),
  otp: Joi.string().required(),
});

module.exports = {
  payeeSchema,
};