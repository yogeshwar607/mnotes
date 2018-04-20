const { query, paramQuery } = rootRequire('commons').DATABASE;

async function logic({ context, params }) {
    try {

        let c = await query('SELECT id, role, description,' +
            'created_on, createy_by, is_deleted, modified_on, ' +
            ' modified_by' +
            ' FROM "Remittance".admin_role WHERE is_deleted=false');

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