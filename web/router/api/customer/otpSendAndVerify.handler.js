const Joi = require('joi');
const Boom = require('boom');
const {
    QueryBuilder,
    database: pg,
    insert,
    update
} = rootRequire('db');

const {
    sendSMS /* @params body , toMobileNo */
} = rootRequire('service').twilio;
const {
    query,
    paramQuery,
    decryptComparePassword
} = rootRequire('commons').DATABASE;
const {
    getErrorMessages,
    generateToken,
    verifyToken,
    generateSecret,
    trimObject,
    postgresDateString,
} = rootRequire('commons').UTILS;
const {
    otpJoiSchema
} = rootRequire('commons').SCHEMA;
const {
    ValidationError
} = rootRequire('commons').ERROR;
const {
    getTableName
} = rootRequire('commons').TABLES;

const tableName = getTableName('otp_verification');
const smsText = '';

function enrichOtpObj(query) {
    return {
        id: query.cust_id,
        otp: query.otp,
    }
}

async function getMobileNumber({
    custId
}) {

    const tableName = getTableName('customer');
    const qb = new QueryBuilder({
        buildTotalQuery: false
    });
    qb.select({
            mobile_number: "mobile_number"
        })
        .from(tableName)
    qb.where(); // 
    qb.and().is("registration_id", custId);
    // qb.limit('1');
    // qb.orderBy("created_on");
    // qb.order('DESC');

    const {
        rows: result
    } = await qb.query(pg);
    return result.length ? result[0]['mobile_number'] : ''
}

async function getSecretFromDb({
    custId
}) {

    const tableName = getTableName('otp_verification');
    const qb = new QueryBuilder({
        buildTotalQuery: false
    });
    qb.select({
            otp_secret: "otp_secret"
        })
        .from(tableName)
    qb.where(); // 
    qb.and().is("cust_id", custId);
    qb.orderBy("created_on");
    qb.order('DESC');
    qb.limit('1');

    const {
        rows: result
    } = await qb.query(pg);
    return result.length && result[0]['otp_secret'] ? result[0]['otp_secret'] : ''
}

async function saveSecretToDb({
    custId,
    secret,
    mobileNumber,
}) {

    const otpObj = {
        cust_id: custId,
        mobile_number: mobileNumber,
        otp_secret: secret
    }
    const tableName = getTableName('otp_verification');
    /** Inserting the data into  otp_verification table */
    const {
        rows: result
    } = await insert({
        tableName: tableName,
        data: otpObj,
    });
    return result
}

async function logOtpFailedEvent({ custId,
    secret}){
        const tableName = getTableName('otp_verification');
        /** update verification_failed_on in otp_verification table */
        const logOtpObj = {
            'verification_failed_on':postgresDateString(new Date())
        }

        let length = Object.keys(logOtpObj).length;
        
        const whereClause = {};
        whereClause.text = `WHERE 1=1 AND cust_id=$${length += 1}`;
        whereClause.text = `${whereClause.text} AND otp_secret=$${length += 1}`
        whereClause.values = [custId ,secret];

        const {
            rows: result
        } = await update({
            tableName: tableName,
            data: logOtpObj,
            whereClause:whereClause
        });
        return result
}

async function updateCustomerOtpVerificationEvent({custId}){
    const tableName = getTableName('customer');
    /** update verification_failed_on in otp_verification table */
    const custOtpUpdateObj = {
        'otp_verified_on':postgresDateString(new Date()),
        'is_otp_verified':true
    }

    let length = Object.keys(custOtpUpdateObj).length;
        
    const whereClause = {};
    whereClause.text = `WHERE 1=1 AND registration_id=$${length += 1}`;
    whereClause.values = [custId];

    const {
        rows: result
    } = await update({
        tableName: tableName,
        data: custOtpUpdateObj,
        whereClause:whereClause
    });
    return result
}

async function logic({
    context,
    query,
}) {
    try {

        // cleaning object 
        const otpObj = trimObject(enrichOtpObj(query));
        const {
            error
        } = Joi.validate(otpObj, otpJoiSchema.otpSchema, {
            abortEarly: false
        });
        if (error) throw Boom.badRequest(getErrorMessages(error));

        if (otpObj.otp && otpObj.otp !='') {
            // verify otp 
            const secret = await getSecretFromDb({
                custId: otpObj.id
            })
            const isValidToken = verifyToken({
                secret: secret,
                token: otpObj.otp
            })
            if(!isValidToken) {
                // log failed otp verification event
                await logOtpFailedEvent({secret,custId:otpObj.id});
            }
            if(isValidToken) {
                // update customer table isOtpVerified , otp_verified_on
                await updateCustomerOtpVerificationEvent({custId:otpObj.id});
            }
            return {
                isVerified: isValidToken,
                msg: isValidToken ? "otp verified successfully" : "invalid/expired otp"
            }
        } else {
            // send otp
            // generate secret
            const secret = generateSecret({
                length: 20
            });

            // retrive mobile_number from cust_id 
            const mobileNumber = await getMobileNumber({
                custId: otpObj.id
            })

            // create record in db for secret
            await saveSecretToDb({
                secret: secret.base32,
                mobileNumber,
                custId: otpObj.id
            });

            const token = generateToken({
                secret: secret.base32
            });

            // retrieve mobile number from db
            const smsResult = await sendSMS({
                body: `Your one time otp is ${token}`,
                toMobileNo: mobileNumber
            })
            if(smsResult.sid && !smsResult.errorCode){
                return {
                    "msg": "otp sent successfully"
                }
            }
            else if(smsResult.errorCode) throw new Boom(smsResult.errorMessage);
        }

    } catch (e) {
        logger.error(e);
        throw new Boom(getErrorMessages(e));
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