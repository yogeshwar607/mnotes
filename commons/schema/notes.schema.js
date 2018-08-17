const Joi = require('joi');

const notesSchema = Joi.object().keys({
  id: Joi.string().required(),
 
});

module.exports = {
  notesSchema,
};