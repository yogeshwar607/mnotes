const { query, paramQuery } = rootRequire('commons').DATABASE;
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

async function logic({ body, context, params }) {
    console.log();
    try {
        let c = await paramQuery('SELECT email,"2fa_key" FROM "Remittance".admin_user WHERE email=$1', [body.data.email]);
        console.log(c[0].fa_key, c[0], body.data.userToken)
        let secret = c[0]['2fa_key'];
        let verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: body.data.userToken
        });
        console.log(verified);
        if (verified == true) {
            await paramQuery('UPDATE "Remittance".admin_user' +
                ' SET is_2fa_enabled=true where email=$1', [body.data.email]);
            return { msg: "2fa enable success" }
        } else {
            return { msg: "invalid 2fa code" }
        }

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