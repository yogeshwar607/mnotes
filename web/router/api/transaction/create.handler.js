const cuid = require('cuid');
const Joi = require('joi');
const Boom = require('boom');

const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('transaction');

const {
    insert,
    getClient
} = rootRequire('db')
const {
    transactionJoiSchema
} = rootRequire('commons').SCHEMA;

const {
    trimObject,
    getErrorMessages,
    getFullName,
    postgresDateString,
    generateUnqNumber
} = rootRequire('commons').UTILS;

function enrichTransactionObj(body) {
    return {

        transaction_id: body.transaction_id,
        transaction_number: body.transaction_number,
        cust_id: body.cust_id,
        payee_id: body.payee_id,

        from_currency: body.from_currency,
        to_currency: body.to_currency,

        from_amount: body.from_amount,
        to_amount: body.to_amount,

        fx_rate_offered: body.fx_rate_offered,
        fx_rate_actual: body.fx_rate_actual,
        fx_rate_bank: body.fx_rate_bank,
        fees: body.fees,
        bank_fees: body.bank_fees,
        discount: body.discount,
        bonus: body.bonus,
        savings: body.savings,

        coupon_code: body.coupon_code,
        is_referral_bonus: body.is_referral_bonus,
        referral_code: body.referral_code,
        source_of_fund: body.source_of_fund,
        source_of_fund_other_description: body.source_of_fund_other_description,
        reason_for_transfer: body.reason_for_transfer,
        reason_for_transfer_other_description: body.reason_for_transfer_other_description,

        status:body.status,

        created_on: postgresDateString(new Date()),
        created_by: body.cust_id,

        modified_on: postgresDateString(new Date()),
        modified_by: body.cust_id,
    }
}

async function logic({
    body,
    context,
    params
}) {
    const client = await getClient();
    logger.info('client fetched');
    try {
        // adding transaction id 
        let transactionId = cuid();
        // adding transaction_id to body
        body['transaction_id'] = transactionId;
        // generate transaction number 
        let transactionNo = `XW${generateUnqNumber()}AP${generateUnqNumber()}`;
        body['transaction_number'] = transactionNo;
        // add status
        body['status'] = "tx01";

        // cleaning object 
        const transactionObj = trimObject(enrichTransactionObj(body));
        const {
            error
        } = Joi.validate(transactionObj, transactionJoiSchema.createTransactionSchema, {
            abortEarly: false
        });

        if (error) throw Boom.badRequest(getErrorMessages(error));

        /** Need to implement atomicity */
        /** ========================== BEGIN QUERY =============================== */
        await client.query('BEGIN');
        logger.info('client BEGIN');

        /** Inserting the data into transaction table */
        const {
            rows: transaction
        } = await insert({
            client,
            tableName: tableName,
            data: transactionObj,
            returnClause: ['transaction_number'],
        });

        /** =========================== COMMIT QUERY ============================= */
        await client.query('COMMIT');
        logger.info('client commited');
        return transaction;

    } catch (e) {
        await client.query('ROLLBACK');
        logger.error(e);
        throw e;
    } finally {
        client.release();
        logger.info('client released in add transaction');
    }
}

function handler(req, res, next) {
    logic(req)
        .then(data => {
            res.json({
                success: true,
                data,
            });
        })
        .catch(err => next(err));
}

module.exports = handler;