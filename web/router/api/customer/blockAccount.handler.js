const { query, paramQuery } = rootRequire('commons').DATABASE;

function db_query(obj) {
    return 'SELECT * from  "Remittance".block_customer_account(\'' +
        obj.vregistration_id + '\',' + obj.vis_account_blocked + ',\'' + obj.vmodified_on + '\',\'' +
        obj.vmodified_by +
        '\')';
}

async function logic({ body, context, params }) {
    console.log(body.data);
    try {

        let obj = {
            "vregistration_id": body.data.vregistration_id,
            "vis_account_blocked": body.data.vis_account_blocked,
            "vmodified_on": body.data.vmodified_on,
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