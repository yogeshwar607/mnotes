const { query, paramQuery } = rootRequire('commons').DATABASE;

function db_query(obj) {
    return 'SELECT * from  "Remittance".delete_individual_doc(\'' +
        obj.vregistration_id + '\',\'' + obj.vdoc_type + '\',\'' + obj.vdeleted_on + '\',\'' + obj.vdeleted_by +
        '\',\'["' + obj.vcomment + '"]\')';
}

async function logic({ body, context, params }) {
    console.log();
    try {

        let obj = {
            "vregistration_id": body.data.vregistration_id,
            "vdoc_type": body.data.vdoc_type,
            "vdeleted_on": body.data.vdeleted_on,
            "vdeleted_by": body.data.vdeleted_by,
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