const Joi = require('joi');

const createDocSchema = Joi.object().keys({
  id: Joi.string().required(),
  otp: Joi.string().optional(),
});

module.exports = {
    createDocSchema,
};