const { query, paramQuery } = rootRequire('commons').DATABASE;

function db_query(obj) {
    return 'SELECT * from  "Remittance".approve_reject_final_verification(\'' +
        obj.vregistration_id + '\',\'' + obj.vdoc_type + '\',' + obj.vis_verified + ',\'' + obj.vverified_on +
        '\',\'' + obj.vverified_by + '\',\'["' + obj.vcomment + '"]\')';
}

async function logic({ body, context, params }) {
    console.log();
    try {

        let obj = {
            "vregistration_id": body.data.vregistration_id,
            "vdoc_type": body.data.vdoc_type,
            "vis_verified": body.data.vis_verified,
            "vverified_on": body.data.vverified_on,
            "vverified_by": body.data.vverified_by,
            "vcomment": body.data.vcomment
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