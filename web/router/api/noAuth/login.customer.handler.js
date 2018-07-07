const jwt = require('jsonwebtoken');
const Joi = require('joi');
const envConfig = require('nconf');
const Boom = require('boom');
const {
    getTableName
} = rootRequire('commons').TABLES;

const {
    QueryBuilder,
    database: pg,
    query: pgQuery,
    decryptComparePassword
} = rootRequire('db');

const {
    trimObject,
    getErrorMessages
} = rootRequire('commons').UTILS;

const {
    customerJoiSchema
} = rootRequire('commons').SCHEMA;


const {
    jwtSecret
} = rootRequire('config').server;

const tableName = getTableName('customer');
const individualCustomerDetail = getTableName('individual_customer_detail');

const columns = {
    registration_id: "cu.registration_id",
    password: "password",
    cust_id: "info.cust_id",
    mobile_number: "cu.mobile_number",
    email: "email",
    type: "type",
    is_email_verified: "is_email_verified",
    is_otp_verified: "is_otp_verified",
    is_transfer_activated: "is_transfer_activated",
    source_of_funds: "source_of_funds",
    first_name: "first_name",
    middle_name: "middle_name",
    last_name: "last_name",
    title: "title",
    dob: "dob",
    country_of_residence: "country_of_residence"
};


function enrichCustomerObj(body) {
    return {
        email: body.email.toLowerCase(),
        password: body.password,
    }
}

async function logic({
    body,
    context,
    params
}) {
    try {
        // cleaning object 
        const customerObj = trimObject(enrichCustomerObj(body));
        const {
            error
        } = Joi.validate(customerObj, customerJoiSchema.loginSchema, {
            abortEarly: false
        });

        if (error) throw Boom.badRequest(getErrorMessages(error));

        const qb = new QueryBuilder({
            buildTotalQuery: false
        });

        qb.select(columns)
            .from(`${tableName} cu`)
            .leftJoin(`${individualCustomerDetail} info`)
            .on(`cu.registration_id = info.cust_id`)

        qb.where(); // 
        qb.and().is(columns.email, customerObj.email);

        let {
            rows: result
        } = await qb.query(pg);

        if (result.length === 0) {
            return {
                msg: "invalid email"
            }
        } else if (result[0].is_email_verified !== true) {
            return {
                msg: "email not verified"
            }
        } else if (result.length !== 0) {
            let f = await decryptComparePassword(customerObj.password, result[0].password);
            if (!f) {
                return {
                    msg: "invalid password"
                }
            } else {

                const text = 'UPDATE "Remittance".customer' +
                    ' SET last_logged_in=now(),modified_on=now()' +
                    ' WHERE email=$1';
                const values = [
                    customerObj.email
                ];
                await pgQuery(text, values);

                const payloads = {
                    // token expiry period set for 1 month (Expiry to be set for 1 hour(60 * 60) in production)
                    exp: envConfig.get("NODE_ENV") === 'production' ? Math.floor(Date.now() / 1000) + (60 * 60) : Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 3),
                    sub: {
                        id: result[0].registration_id,
                        loginType: "customer"
                    }
                };
                const token = jwt.sign(payloads, jwtSecret);
                delete result[0]['password'];
                return {
                    user: result,
                    token: token
                };
            }
        }
    } catch (e) {
        logger.error(e);
        throw e;
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