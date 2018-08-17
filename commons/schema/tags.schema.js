const Joi = require('joi');

const tagsSchema = Joi.object().keys({
  id: Joi.string().required(),
 
});

module.exports = {
  tagsSchema,
};