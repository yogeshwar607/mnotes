const { query, paramQuery } = rootRequire('commons').DATABASE;

async function logic({ body, context, params }) {
    try {
        let values = [body.data.email, body.data.password, body.data.role_id,
            body.data.created_on, body.data.created_by, body.data.is_Deleted,
            body.data.modified_on, body.data.modified_by, body.data.id
        ];
        let c = await paramQuery('UPDATE "Remittance".admin_user' +
            'SET email=$1, password=$2, role_id=$3, created_on=$4, created_by=$5,' +
            'is_deleted=$6, modified_on=$7, modified_by=$8' +
            'WHERE id=$9', values);

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