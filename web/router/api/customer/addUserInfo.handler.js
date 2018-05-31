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
    customerJoiSchema
} = rootRequire('commons').SCHEMA;
const {
    ValidationError
} = rootRequire('commons').ERROR;

function enrichAddUserInfoObj(body) {
    return {
        id: body.id,
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
        country_of_residence: body.country_of_residence
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
        const addUserInfoObj = trimObject(enrichAddUserInfoObj(body));
        const {
            error
        } = Joi.validate(addUserInfoObj, customerJoiSchema.addUserInfoSchema, {
            abortEarly: false
        });
        if (error) throw new ValidationError(getErrorMessages(error));

      

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
            obj.msg = "added successfully"
            obj.status = true
        } else {
            obj.msg = "added successfully"
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
            obj.msg = "added successfully"
            obj.status = true
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