const { query, paramQuery } = rootRequire('commons').DATABASE;

function db_query(obj) {
    return 'SELECT * from  "Remittance".block_customer_transaction(\'' +
        obj.vregistration_id + '\',' + obj.vis_transaction_blocked + ',\'' + obj.vmodified_on + '\',\'' +
        obj.vmodified_by +
        '\')';
}

async function logic({ body, context, params }) {
    console.log();
    try {

        let obj = {
            "vregistration_id": body.data.vregistration_id,
            "vis_transaction_blocked": body.data.vis_transaction_blocked,
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