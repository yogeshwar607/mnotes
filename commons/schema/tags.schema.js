const Joi = require('joi');

const tagsSchema = Joi.object().keys({
  tvalue: Joi.string().required(),
 
});

module.exports = {
  tagsSchema,
};