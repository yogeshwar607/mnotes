const {
    query,
    paramQuery,
    decryptComparePassword,
    encryptPassword
} = rootRequire('commons').DATABASE;

function db_query(obj) {
    return 'SELECT * from  "Remittance".change_password(\'' +
        obj.vregistration_id + '\',\'' + obj.vold_password + '\',\'' + obj.vnew_password + '\',\'' +
        obj.vmodified_by +
        '\')';
}

async function logic({ body, context, params }) {
    console.log();
    try {
        let oldPass = await encryptPassword(body.data.oldPass);
        let newPass = await encryptPassword(body.data.newPass);
        let obj = {
            "vregistration_id": body.data.vregistration_id,
            "vold_password": oldPass,
            "vnew_password": newPass,
            "vmodified_by": body.data.vmodified_by

        };
        console.log(db_query(obj));
        let c = await paramQuery(db_query(obj));

        return c;
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