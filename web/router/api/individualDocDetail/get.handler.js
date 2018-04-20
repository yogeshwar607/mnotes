const { query, paramQuery } = rootRequire('commons').DATABASE;

async function logic({ context, params }) {
    try {

        let c = await query('SELECT id, registration_id, doc_type, doc_path, is_deleted, deleted_on,' +
            'deleted_by, is_verified, verified_on, verified_by, uploaded_on,' +
            'uploaded_by, comment, doc_detail ' +
            'FROM "Remittance".individual_doc_detail'
        );

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