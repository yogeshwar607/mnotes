const { query, paramQuery } = rootRequire('commons').DATABASE;

async function logic({ body, context, params }) {
    console.log(body.data);
    try {
        let values = [body.data.id,
            body.data.is_Deleted,
            body.data.modified_by
        ];
        let c = await paramQuery('UPDATE "Remittance".admin_role_map' +
            ' SET   is_deleted=$2, ' +
            '  modified_on=now(), modified_by=$3' +
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