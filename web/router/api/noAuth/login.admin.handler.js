const jwt = require('jsonwebtoken');
const Joi = require('joi');
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
    ValidationError
} = rootRequire('commons').ERROR;
const {
    jwtSecret
} = rootRequire('config').server;

function enrichAdminObj(body) {
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
        const adminObj = trimObject(enrichAdminObj(body));
        const {
            error
        } = Joi.validate(adminObj, customerJoiSchema.loginSchema, {
            abortEarly: false
        });

        if (error) throw Boom.badRequest(getErrorMessages(error));

        const text = 'SELECT admin_id, email, password' +
            ' FROM "Remittance".admin_user WHERE email=$1';
        const values = [
            adminObj.email
        ];
        const {
            rows: result
        } = await pgQuery(text, values);

        if (result.length === 0) {
            throw Boom.unauthorized('invalid email');
        } else if (result.length !== 0) {
            let f = await decryptComparePassword(adminObj.password, result[0].password);
            if (!f) {
                throw Boom.unauthorized('invalid password');
            } else {
                const payloads = {
                    // token expiry period set for 1 month (Expiry to be set for 1 hour(60 * 60) in production)
                    exp: process.env.NODE_ENV === 'production' ? Math.floor(Date.now() / 1000) + (60 * 60) : Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
                    sub: {
                        id: result[0].admin_id,
                        loginType: "admin"
                    }
                };
                const token = jwt.sign(payloads, jwtSecret);
                return {
                    user: result[0],
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