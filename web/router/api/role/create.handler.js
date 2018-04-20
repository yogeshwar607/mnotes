const { query, paramQuery } = rootRequire('commons').DATABASE;

async function logic({ body, context, params }) {
    console.log();
    try {
        let values = [body.data.role, body.data.description,
            body.data.created_by, body.data.is_Deleted, body.data.modified_by
        ];
        let c = await paramQuery('INSERT INTO "Remittance".admin_role(' +
            ' role, description, created_on, createy_by, is_deleted, modified_on, ' +
            ' modified_by)' +
            'VALUES ( $1, $2, now(), $3, $4, now(), ' +
            '$5)', values);

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