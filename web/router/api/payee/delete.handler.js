const { query, paramQuery } = rootRequire('commons').DATABASE;


function db_query(obj) {
    return 'SELECT * from  "Remittance".delete_payee(' +
        obj.vid + ',\'' + obj.vdeleted_on +
        '\',\'' + obj.vdeleted_by + '\')';
}


async function logic({ body, context, params }) {
    try {

        let obj = {
            "vid": body.data.vid,
            "vdeleted_on": body.data.vdeleted_on,
            "vdeleted_by": body.data.vdeleted_by
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