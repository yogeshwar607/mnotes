const { query, paramQuery } = rootRequire('commons').DATABASE;

function db_query(obj) {
    return 'SELECT * from  "Remittance".approve_reject_initial_verification(\'' +
        obj.vregistration_id + '\',' + obj.vdoc_id + ',' + obj.vis_approved + ',\'' + obj.vapproved_on +
        '\',\'' + obj.vapproved_by + '\',\'["' + obj.vcomment + '"]\')';
}

async function logic({ body, context, params }) {
    console.log();
    try {

        let obj = {
            "vregistration_id": body.data.vregistration_id,
            "vdoc_id": body.data.vdoc_id,
            "vis_approved": body.data.vis_approved,
            "vapproved_on": body.data.vapproved_on,
            "vapproved_by": body.data.vapproved_by,
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