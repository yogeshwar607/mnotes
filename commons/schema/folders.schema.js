const Joi = require('joi');

const foldersSchema = Joi.object().keys({
  id: Joi.string().required(),
 
});

module.exports = {
  foldersSchema,
};