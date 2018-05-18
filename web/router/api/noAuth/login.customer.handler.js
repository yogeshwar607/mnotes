const jwt = require('jsonwebtoken');
const Joi = require('joi');
const envConfig = require('nconf');
const Boom = require('boom');

const {
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

        const text = 'SELECT registration_id, email, password, source, type,' +
            'is_email_verified,' +
            'email_verified_on, is_otp_verified, otp_verified_on, is_transfer_activated,' +
            'transfer_activated_on, is_account_blocked, is_transaction_blocked, ' +
            'last_logged_in, created_on, modified_on, modified_by' +
            ' FROM "Remittance".customer WHERE email=$1';
        const values = [
            customerObj.email
        ];
        const {
            rows: result
        } = await pgQuery(text, values);

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