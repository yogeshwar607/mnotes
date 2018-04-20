const { query, paramQuery, encryptPassword } = rootRequire('commons').DATABASE;

function db_query(vregistration_id, vtype, vmodified_by) {
    return 'SELECT * from  "Remittance".customer_type_update(\'' +
        vregistration_id + '\',\'' + vtype + '\',\'' + vmodified_by + '\')';
}

async function logic({ body, context, params }) {
    console.log();
    try {

        let c = await paramQuery(db_query(body.data.vregistration_id, body.data.vtype, body.data.vmodified_by));
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