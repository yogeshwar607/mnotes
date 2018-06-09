const customerJoiSchema = require('./customer.schema');
const otpJoiSchema = require('./otp.schema');
const payeeJoiSchema = require('./payee.schema');
const transactionJoiSchema = require('./transaction.schema');

module.exports = {
  transactionJoiSchema,
  customerJoiSchema,
  payeeJoiSchema,  
  otpJoiSchema,
};