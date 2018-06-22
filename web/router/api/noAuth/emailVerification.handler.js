const jwt = require('jsonwebtoken');
const {
    jwtSecret
} = rootRequire('config').server;
const {
    QueryBuilder,
    database: pg,
} = rootRequire('db');

const {
    getTableName
} = rootRequire('commons').TABLES;
const {
    verifyToken,
    generateSecret,
    trimObject,
    postgresDateString,
} = rootRequire('commons').UTILS;

async function updateCustomerEmailVerificationEvent({
    custId
}) {
    const tableName = getTableName('customer');
    /** update verification_failed_on in otp_verification table */
    const custEmailUpdateObj = {
        'email_verified_on': postgresDateString(new Date()),
        'is_email_verified': true
    }

    let length = Object.keys(custEmailUpdateObj).length;

    const whereClause = {};
    whereClause.text = `WHERE 1=1 AND registration_id=$${length += 1}`;
    whereClause.values = [custId];

    const {
        rows: result
    } = await update({
        tableName: tableName,
        data: custOtpUpdateObj,
        whereClause: whereClause
    });
    return result
}

async function logic({
    context,
    params
}) {
    let custId
    try {
        // validate this token as same to otp validation
        const token = params.id;
        jwt.verify(token, jwtSecret, async function (err, decoded) {
            if (err) {
                logger.error(`The error while decoding token ${err}`);
                return {
                    "msg": "Error in verifying email",
                    "is_email_verified": false
                };
            }
            custId = [decoded.sub.id];
            return {
                "msg":"email verified successfully",
                "is_email_verified": true
            };
        })

    } catch (e) {
        logger.error(e);
        throw e;
    } finally {
        updateCustomerEmailVerificationEvent({
            custId
        })
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