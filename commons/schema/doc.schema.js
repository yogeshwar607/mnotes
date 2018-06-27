const Joi = require('joi');

const createDocSchema = Joi.object().keys({
  cust_id: Joi.string().required(),
  doc_type:Joi.string().required(),
  transaction_id:Joi.string().optional(),
  doc_path:Joi.string().required(),
  uploaded_by: Joi.string().optional(),
  comment :Joi.any().optional(),
  doc_detail:Joi.any().optional(),
  uploaded_on:Joi.any().optional(),
});

module.exports = {
    createDocSchema,
};