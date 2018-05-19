const Joi = require('joi');
const constants = rootRequire('constants');

const payeeSchema = Joi.object().keys({
  payee_id: Joi.string().required(),
  full_name: Joi.string().required(),
  cust_id: Joi.string().required(),
  alias: Joi.string().optional().allow(''),
  email: Joi.string(),
  pincode: Joi.string().optional().allow(''),
  title: Joi.string().optional().allow(''),
  first_name: Joi.string().optional().allow(''),
  middle_name: Joi.string().optional().allow(''),
  last_name: Joi.string().optional().allow(''),
  company_name: Joi.string().optional().allow(''),
  is_active: Joi.boolean().optional(),
  is_company_payee: Joi.boolean().optional(),
  source: Joi.string().optional().valid(['api', 'website']),
  state: Joi.string().optional().allow(''),
  city: Joi.string().optional().allow(''),
  mobile_number: Joi.string().optional().allow(''),
  account_number: Joi.string().required(),
  bank_name: Joi.string().required(),
  bank_code: Joi.string().optional().allow(''),
  account_type: Joi.string().optional(),
  country_code: Joi.string().required().valid(constants.COUNTRIES),
  relationship: Joi.string().optional().allow(''),
  address: Joi.string().optional().allow(''),
  routing_code_type_1: Joi.string().optional().allow('').valid(constants.ROUTING_CODE_TYPE),
  routing_code_value_1: Joi.string().optional().allow(''),
  routing_code_type_2: Joi.string().optional().allow('').valid(constants.ROUTING_CODE_TYPE),
  routing_code_value_2: Joi.string().optional().allow(''),
  routing_code_type_3: Joi.string().optional().allow('').valid(constants.ROUTING_CODE_TYPE),
  routing_code_value_3: Joi.string().optional().allow('')
});

module.exports = {
  payeeSchema,
};