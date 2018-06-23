const Joi = require('joi');
const {
  PASSWORD_REGEX
} = rootRequire('constants');

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required().regex(PASSWORD_REGEX),
});

const addUserInfoSchema = Joi.object().keys({
  cust_id: Joi.string().required(),
  first_name: Joi.string().required(),
  middle_name: Joi.string().required(),
  last_name: Joi.string().required(),
  title: Joi.string().required(),
  dob: Joi.string().required(),
  address_line1: Joi.string().required(),
  address_line2: Joi.string().required(),
  postal_code: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
  nationality: Joi.string().required(),
  employment_status: Joi.string().required(),
  source_of_funds: Joi.string().required(),
  is_pep: Joi.bool().required(),
  intended_use_of_account: Joi.string().required(),
  net_worth: Joi.number().required(),
  type_of_industry: Joi.string().required(),
  is_dual_citizen: Joi.bool().required(),
  country_of_residence: Joi.string().required(),
  country_of_transaction:Joi.string().required(),
  mobile_number:  Joi.string().optional(),
});

const createCustomerSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  mobile_number:  Joi.string().required(),
  source: Joi.string().required(),
  type: Joi.string().required(),
  is_email_verified: Joi.bool().optional(),
  is_otp_verified: Joi.bool().optional(),
  is_transfer_activated: Joi.bool().optional(),
  is_account_blocked: Joi.bool().optional(),
  is_transaction_blocked: Joi.bool().optional(),
  registration_id: Joi.string().required(),
});

module.exports = {
  loginSchema,
  addUserInfoSchema,
  createCustomerSchema,
};