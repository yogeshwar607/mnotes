
const Joi = require('joi');

const {
    query,
    paramQuery,
    decryptComparePassword
} = rootRequire('commons').DATABASE;
const {
    trimObject,
    getErrorMessages
} = rootRequire('commons').UTILS;
const {
    otpJoiSchema
} = rootRequire('commons').SCHEMA;
const {
    ValidationError
} = rootRequire('commons').ERROR;

function enrichOtpObj(body) {
    return {
        id: body.id,
        otp: body.otp,
    }
}


function db_query(obj) {
    return 'SELECT * from  "Remittance".otp_verification(\'' +
        obj.vregistration_id + '\',' + obj.vis_otp_verified + ',\'' + obj.votp_verified_on + '\',\'' +
        obj.vmodified_by +
        '\')';
}

async function logic({
    body,
    context,
    params
}) {
    console.log();
    try {
             // cleaning object 
             const otpObj = trimObject(enrichOtpObj(body));
             const {
                 error
             } = Joi.validate(otpObj, otpJoiSchema.otpSchema, {
                 abortEarly: false
             });
             if (error) throw new ValidationError(getErrorMessages(error));
         
        // let obj = {
        //     "vregistration_id": body.id,
        //     "vis_otp_verified": body.vis_otp_verified,
        //     "votp_verified_on": Date.now() ||body.votp_verified_on,
        //     "vmodified_by": body.data.vmodified_by
        // };
        // console.log(db_query(obj));
        // let c = await paramQuery(db_query(obj));

        // return c;

        return mock()

    } catch (e) {
        logger.error(e);
        throw e;
    }
}

function mock() {
    let z = Math.floor(Math.random() * 100);
    let y = z % 2;
    let obj = {};
    if (y === 0) {

        let a = Math.floor(Math.random() * 100);
        let b = a % 2;

        if (b === 0) {
            obj.msg = "invalid otp",
            obj.status = false
        } else {
            obj.msg = "otp verified successfully"
            obj.status = true
        }
    } else {

        let a = Math.floor(Math.random() * 100);
        let b = a % 2;

        if (b === 0) {
            obj.is_customer_exists = false;
            obj.status = false
            obj.msg = "provided id do not exists"
        } else {
            obj.is_otp_verified = true;
            obj.status = false;
            obj.msg = "otp already verified for current user"
        }
    }
    return obj;
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