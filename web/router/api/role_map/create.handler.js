const { query, paramQuery } = rootRequire('commons').DATABASE;

async function logic({ body, context, params }) {
    console.log(body.data);
    try {
        let values = [body.data.role_id, body.data.page_name,
            body.data.created_on, body.data.created_by, body.data.is_Deleted, body.data.modified_on, body.data.modified_by
        ];
        let c = await paramQuery('INSERT INTO "Remittance".admin_role_map(' +
            ' role_id, page_name, created_on, created_by, is_deleted, modified_on,' +
            'modified_by)' +
            ' VALUES ($1, $2, $3, $4, $5, $6, $7 )', values);

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