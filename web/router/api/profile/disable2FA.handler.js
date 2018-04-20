const { query, paramQuery } = rootRequire('commons').DATABASE;
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

async function logic({ body, context, params }) {
    console.log();
    try {

        return await paramQuery('UPDATE "Remittance".admin_user' +
            ' SET is_2fa_enabled=false where email=$1', [body.data.email]);

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