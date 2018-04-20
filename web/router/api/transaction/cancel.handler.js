const { query, paramQuery } = rootRequire('commons').DATABASE;


function db_query(obj) {
    return 'SELECT * from  "Remittance".cancel_transaction(' +
        '\'' + obj.vtransaction_id + '\',' + obj.vis_cancelled +
        ',\'' + obj.vcancelled_on + '\',\'' + obj.vcancelled_by + '\')';
}


async function logic({ body, context, params }) {
    try {

        let obj = {
            "vtransaction_id": body.data.vtransaction_id,
            "vis_cancelled": body.data.vis_cancelled,
            "vcancelled_on": body.data.vcancelled_on,
            "vcancelled_by": body.data.vcancelled_by
        };

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