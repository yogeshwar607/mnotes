const Boom = require('boom');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const config = rootRequire('config').server;
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('customer');

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
    getErrorMessages
} = rootRequire('commons').UTILS;

function enrichCustomerObj(body){
    return {
        email:body.email,
        password:body.password, 
        source:body.source, 
        type:body.type,
        is_email_verified:body.is_email_verified, 
        is_otp_verified:body.is_otp_verified,
        is_transfer_activated:body.is_transfer_activated,
        is_account_blocked:body.is_account_blocked, 
        is_transaction_blocked:body.is_transaction_blocked,
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
    try {
       
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
        logger.info('client commited');
        return customer;

    } catch (e) {
        await client.query('ROLLBACK');
        logger.error(e);
        throw e;
    } finally {
        client.release();
        logger.info('client released in add payee');
    }
}

async function sendMail(email) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'yogeshwar607@gmail.com', // Your email id
            pass: 'marjavamitjava' // Your password
        }
    });

    const payloads = {
        // token expiry period set for 1 month (Expiry to be set for 1 hour(60 * 60) in production)
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
        sub: email,
    };
    const token = jwt.sign(payloads, config.jwtSecret);

    let text = 'Click on the link to verify: ' + "http://localhost:4700/api/v1/email/verify/" + token;

    let mailOptions = {
        from: 'yogeshwar607@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'Remi: Email Verify', // Subject line
        text: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            // res.json({ yo: 'error' });
        } else {
            console.log('Message sent: ' + info.response);
            return true;
            // res.json({ yo: info.response });
        };
    });
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