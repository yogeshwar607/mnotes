const Joi = require('joi');
const constants = rootRequire('constants');

const createTransactionSchema = Joi.object().keys({

    transaction_id:  Joi.string().required(),
    transaction_number: Joi.string().required(),
    payee_id: Joi.string().required(),
    cust_id: Joi.string().required(),

    from_currency: Joi.string().required(),
    to_currency:Joi.string().required(),
   
    from_amount:Joi.number().required(),
    to_amount:Joi.number().required(),

    fx_rate_offered:Joi.number().optional().allow(''),
    fx_rate_actual:Joi.number().optional().allow(''),
    fx_rate_bank:Joi.number().optional().allow(''),
    fees:Joi.number().optional().allow(''),
    bank_fees:Joi.number().optional().allow(''),
    discount:Joi.number().optional().allow(''),
    bonus:Joi.number().optional().allow(''),
    savings:Joi.number().optional().allow(''),

    coupon_code:Joi.string().optional().allow(''),
    is_referral_bonus:Joi.boolean().optional(),
    referral_code:Joi.string().optional().allow(''),
    source_of_fund:Joi.string().optional().allow(''),
    source_of_fund_other_description:Joi.string().optional().allow(''),
    reason_for_transfer:Joi.string().optional().allow(''),
    reason_for_transfer_other_description:Joi.string().optional().allow(''),


    created_on: Joi.string().optional().allow(''),
    created_by: Joi.string().optional().allow(''),

    modified_on: Joi.string().optional().allow(''),
    modified_by: Joi.string().optional().allow(''),
});


module.exports = {
    createTransactionSchema,
};