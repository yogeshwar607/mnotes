const Joi = require('joi');
const Boom = require('boom');

const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('individual_customer_detail');

const {
    insert,
    getClient
} = rootRequire('db')

const {
    trimObject,
    getErrorMessages
} = rootRequire('commons').UTILS;
const {
    customerJoiSchema
} = rootRequire('commons').SCHEMA;

function enrichAddUserInfoObj(body) {
    return {
        cust_id: body.id,
        first_name: body.first_name,
        middle_name: body.middle_name,
        last_name: body.last_name,
        title: body.title,
        dob: body.dob,
        address_line1: body.address_line1,
        address_line2: body.address_line2,
        postal_code: body.postal_code,
        state: body.state,
        city: body.city,
        nationality: body.nationality,
        employment_status: body.employment_status,
        source_of_funds: body.source_of_funds,
        is_pep: body.is_pep,
        intended_use_of_account: body.intended_use_of_account,
        net_worth: body.net_worth,
        type_of_industry: body.type_of_industry,
        is_dual_citizen: body.is_dual_citizen,
        country_of_residence: body.country_of_residence,
        country_of_transaction:body.country_of_transaction
    }
}

async function logic({
    body,
    context,
    params
}) {
    const client = await getClient();
    logger.info('client fetched in addUserInfo');

    try {
        // cleaning object 
        const addUserInfoObj = trimObject(enrichAddUserInfoObj(body));
        const {
            error
        } = Joi.validate(addUserInfoObj, customerJoiSchema.addUserInfoSchema, {
            abortEarly: false
        });
        if (error) throw Boom.badRequest(getErrorMessages(error));

        /** Need to implement atomicity */
        /** ========================== BEGIN QUERY =============================== */
        await client.query('BEGIN');
        logger.info('client BEGIN addUserInfo');

        /** Inserting the data into payee table */
        const {
            rows: customer
        } = await insert({
            client,
            tableName: tableName,
            data: addUserInfoObj,
            returnClause: ['cust_id'],
        });

        /** =========================== COMMIT QUERY ============================= */
        await client.query('COMMIT');
        logger.info('client commited in customer addUserInfo.handler');
        return customer;

    } catch (e) {
        await client.query('ROLLBACK');
        logger.error(e);
        throw e;
    } finally {
        client.release();
        logger.info('client released in addUserInfo customer');
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