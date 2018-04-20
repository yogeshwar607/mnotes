const { query, paramQuery } = rootRequire('commons').DATABASE;

async function logic({ body, context, params }) {
    console.log(body.data);
    try {
        let values = [body.data.id, body.data.role_id, body.data.page_name,
            body.data.is_Deleted,
            body.data.modified_by
        ];
        let c = await paramQuery('UPDATE "Remittance".admin_role_map' +
            ' SET  role_id=$2, page_name=$3, is_deleted=$4, ' +
            '  modified_on=now(), modified_by=$5' +
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