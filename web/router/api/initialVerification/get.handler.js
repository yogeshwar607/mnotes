const { query, paramQuery } = rootRequire('commons').DATABASE;

function db_query() {
    return 'SELECT * from  "Remittance".get_initial_verification_customer()';
}

async function logic({ context, params }) {
    try {

        let c = await paramQuery(db_query());

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