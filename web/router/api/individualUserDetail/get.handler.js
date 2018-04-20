const { query, paramQuery } = rootRequire('commons').DATABASE;

function db_query(vregistration_id) {
    if (vregistration_id == null) {
        return 'SELECT * from  "Remittance".get_customers(' + vregistration_id + ')';
    } else {
        return 'SELECT * from  "Remittance".get_customers(\'' + vregistration_id + '\')';
    }
}

async function logic({ context, params }) {
    try {

        let regi_id = [params.regi_id];

        if (regi_id[0] == undefined) {
            regi_id[0] = null;
        }
        let c = await paramQuery(db_query(regi_id[0]));
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