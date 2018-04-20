const { query, paramQuery } = rootRequire('commons').DATABASE;
const jwt = require('jsonwebtoken');
const { jwtSecret } = rootRequire('config').server;

function db_query(vregistration_id) {
    return 'SELECT * from  "Remittance".email_verification(\'' + vregistration_id + '\')';
}

async function logic({ context, params }) {
    try {

        jwt.verify(params.id, jwtSecret, async function(err, decoded) {
            if (err) {
                logger.error(`The error while decoding token ${err}`);
                return next(err);
            }

            let c = await paramQuery(db_query(decoded.sub));
            return c[0].message;

        });
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