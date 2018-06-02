const Boom = require('boom');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const config = rootRequire('config').server;
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const nconf = require('nconf');
const baseUrl = nconf.get('baseUrl');

const {confirmEmailTemplate} = rootRequire('templates');
const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('customer');

const {sendMail} = rootRequire('service');
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
        mobile_number : body.mobile_number,
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

         // send email to user for verification
         let token = "cxcxcxcxcxcxcxcxcxcxcxcxcxcx"
         let url = `/email/verify/${token}`
         const templateOptions = {
             url:`${baseUrl}${url}`
         }
         const template = confirmEmailTemplate({templateOptions})
         sendMail([customerObj.email], 'Xwapp email verification', template, { contentType: 'text/html' }, ['yogeshwar@instigence.com']);
     
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