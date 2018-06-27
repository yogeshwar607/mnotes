const cuid = require('cuid');
const Joi = require('joi');
const Boom = require('boom');

const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('payees');

const {
    update,
    getClient
} = rootRequire('db')
const {
    payeeJoiSchema
} = rootRequire('commons').SCHEMA;

const {
    trimObject,
    getErrorMessages,
    getFullName,
    postgresDateString
} = rootRequire('commons').UTILS;

function enrichpayeeObj(body) {
   return {
       is_active:body.is_active,
   }
    // const fullName = getFullName({
    //     firstName: body.first_name,
    //     middleName: body.middle_name,
    //     lastName: body.last_name,
    // });
    // return {
    //     email: body.email ? body.email.toLowerCase() : '',
    //     payee_id: body.payee_id,
    //     cust_id: body.cust_id,
    //     alias: body.alias ? body.alias.toLowerCase() : '',
    //     pincode: body.pincode,
    //     title: body.title,
    //     first_name: body.first_name,
    //     middle_name: body.middle_name,
    //     last_name: body.last_name,
    //     full_name: fullName,
    //     company_name: body.company_name || 'individual',
    //     is_active: body.is_active,
    //     is_company_payee: body.is_company_payee,
    //     source: body.source || 'api',
    //     state: body.state,
    //     city: body.city,
    //     mobile_number: body.mobile_number,
    //     account_number: body.account_number,
    //     bank_name: body.bank_name,
    //     bank_code: body.bank_code,
    //     account_type: body.account_type,
    //     country_code: body.country_code,
    //     relationship: body.relationship,
    //     address: body.address,
    //     routing_code_type_1: body.routing_code_type_1,
    //     routing_code_value_1: body.routing_code_value_1,
    //     routing_code_type_2: body.routing_code_type_2,
    //     routing_code_value_2: body.routing_code_value_2,
    //     routing_code_type_3: body.routing_code_type_3,
    //     routing_code_value_3: body.routing_code_value_3,

    //     created_on: postgresDateString(new Date()),
    //     created_by: body.cust_id,

    //     modified_on: postgresDateString(new Date()),
    //     modified_by: body.cust_id,
    // }

}

async function logic({
    body,
    context,
    params
}) {
    const client = await getClient();
    logger.info('client fetched');
    try {

        const payee_id = params.id;
        if (!payee_id) return Boom.badRequest(`${'payee'} id is not present`);
       
        // cleaning object 
        const payeeObj = trimObject(enrichpayeeObj(body));
        const {
            error
        } = Joi.validate(payeeObj, payeeJoiSchema.updatePayeeSchema, {
            abortEarly: false
        });

        if (error) throw Boom.badRequest(getErrorMessages(error));

        const payeeWhereClause = {} ;
        let length = Object.keys(payeeObj).length;

        payeeWhereClause.text = `WHERE 1=1 AND payee_id=$${length += 1}`;
        payeeWhereClause.values = [payee_id];

        /** Need to implement atomicity */
        /** ========================== BEGIN QUERY =============================== */
        await client.query('BEGIN');
        logger.info('client BEGIN');

        /** updating data into payee table */
        const {
            rows: payee
        } = await update({
            client,
            tableName: tableName,
            whereClause: payeeWhereClause,
            data: payeeObj,
            returnClause: ['payee_id'],
        });

        /** =========================== COMMIT QUERY ============================= */
        await client.query('COMMIT');
        logger.info('client commited');
        return payee;

    } catch (e) {
        await client.query('ROLLBACK');
        logger.error(e);
        throw e;
    } finally {
        client.release();
        logger.info('client released in update payee');
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