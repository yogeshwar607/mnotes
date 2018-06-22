const Boom = require('boom');
const nodemailer = require('nodemailer');
const config = rootRequire('config').server;
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const Joi = require('joi');
const envConfig = require('nconf');
const baseUrl = envConfig.get('baseUrl');
const {
    jwtSecret
    } = rootRequire('config').server;
const {
    confirmEmailTemplate
} = rootRequire('templates');
const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('customer');

const {
    sendMail
} = rootRequire('service');
const {
    customerJoiSchema
} = rootRequire('commons').SCHEMA;

const {
    insert,
    getClient,
    encryptPassword,
} = rootRequire('db');

const {
    trimObject,
    getErrorMessages,
    postgresDateString,
} = rootRequire('commons').UTILS;

async function saveSecretToDb({
    custId,
    secret,
}) {

    const emailObj = {
        cust_id: custId,
        email_secret: secret,
        created_on: postgresDateString(new Date()),
    }
    const tableName = getTableName('email_verification');
    /** Inserting the data into  otp_verification table */
    const {
        rows: result
    } = await insert({
        tableName: tableName,
        data: emailObj,
    });
    return result
}


function enrichCustomerObj(body) {
    return {
        email: body.email,
        password: body.password,
        source: body.source,
        type: body.type,
        mobile_number: body.mobile_number,
        is_email_verified: body.is_email_verified,
        is_otp_verified: body.is_otp_verified,
        is_transfer_activated: body.is_transfer_activated,
        is_account_blocked: body.is_account_blocked,
        is_transaction_blocked: body.is_transaction_blocked,
        registration_id: body.registrationId
    }
}

async function logic({
    body,
    context,
    params
}) {
    const client = await getClient();
    logger.info('client fetched');

    let password = await encryptPassword(body.password);
    let registrationId = uuidv4();

    // adding password and registrationId to body object
    body['password'] = password;
    body['registrationId'] = registrationId;

    // cleaning object 
    const customerObj = trimObject(enrichCustomerObj(body));
    const {
        error
    } = Joi.validate(customerObj, customerJoiSchema.createCustomerSchema, {
        abortEarly: false
    });

    if (error) throw Boom.badRequest(getErrorMessages(error));

    try {

        /** Need to implement atomicity */
        /** ========================== BEGIN QUERY =============================== */
        await client.query('BEGIN');
        logger.info('client BEGIN');

        /** Inserting the data into payee table */
        const {
            rows: customer
        } = await insert({
            client,
            tableName: tableName,
            data: customerObj,
            returnClause: ['registration_id'],
        });

        /** =========================== COMMIT QUERY ============================= */
        await client.query('COMMIT');
        logger.info('client commited in customer create.handler');
        return customer;

    } catch (e) {
        await client.query('ROLLBACK');
        logger.error(e);
        throw e;
    } finally {
        client.release();
        logger.info('client released in create customer');

        const payloads = {
            // token expiry period set for 1 month (Expiry to be set for 1 hour(60 * 15))
            exp: envConfig.get("NODE_ENV") === 'production' ? Math.floor(Date.now() / 1000) + (60 * 15) : Math.floor(Date.now() / 1000) + (60 * 15),
            sub: {
                id: registrationId,
                loginType: "customer"
            }
        };
        const token = jwt.sign(payloads, jwtSecret);
        let url = `/email/verify/${token}`
        const templateOptions = {
            url: `${baseUrl}${url}`
        }
        const template = confirmEmailTemplate({
            templateOptions
        })
        try {
            sendMail([customerObj.email], 'Xwapp email verification', template, {
                contentType: 'text/html'
            }, ['yogeshwar@instigence.com']);

        } catch (e) {
            logger.error(e);
            throw e;
        }
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