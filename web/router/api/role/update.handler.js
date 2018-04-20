const { query, paramQuery } = rootRequire('commons').DATABASE;

async function logic({ body, context, params }) {
    console.log(body.data)
    try {
        let values = [body.data.id, body.data.role, body.data.description,
            body.data.is_Deleted,
            body.data.modified_on, body.data.modified_by
        ];
        let c = await paramQuery('UPDATE "Remittance".admin_role' +
            ' SET role=$2, description=$3, is_deleted=$4,' +
            'modified_on=$5, modified_by=$6' +
            ' WHERE id=$1', values);
        console.log(c);

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