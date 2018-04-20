const { query, paramQuery } = rootRequire('commons').DATABASE;

async function logic({ body, context, params }) {
    try {
        let values = [body.data.id, body.data.is_Deleted,
            body.data.modified_on, body.data.modified_by
        ];
        let c = await paramQuery('UPDATE "Remittance".admin_role' +
            ' SET  is_deleted=$2,' +
            'modified_on=$3, modified_by=$4' +
            ' WHERE id=$1', values);

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