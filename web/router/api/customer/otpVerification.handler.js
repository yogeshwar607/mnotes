const { query, paramQuery } = rootRequire('commons').DATABASE;

function db_query(obj) {
    return 'SELECT * from  "Remittance".otp_verification(\'' +
        obj.vregistration_id + '\',' + obj.vis_otp_verified + ',\'' + obj.votp_verified_on + '\',\'' +
        obj.vmodified_by +
        '\')';
}

async function logic({ body, context, params }) {
    console.log();
    try {

        let obj = {
            "vregistration_id": body.data.vregistration_id,
            "vis_otp_verified": body.data.vis_otp_verified,
            "votp_verified_on": body.data.votp_verified_on,
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