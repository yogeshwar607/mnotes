const { query, paramQuery } = rootRequire('commons').DATABASE;

async function logic({ body, context, params }) {
    try {
        let values = [body.data.is_Deleted,
            body.data.modified_on, body.data.modified_by, body.data.id
        ];
        let c = await paramQuery('UPDATE "Remittance".admin_user' +
            ' SET ' +
            ' is_deleted=$1, modified_on=$2, modified_by=$3' +
            ' WHERE id=$4', values);

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