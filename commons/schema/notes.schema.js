const Joi = require('joi');

const createSchema = Joi.object().keys({
  nid: Joi.string().required(),
  ntext: Joi.string().required(),
  fid: Joi.string().required(),
});

module.exports = {
    createSchema,
};