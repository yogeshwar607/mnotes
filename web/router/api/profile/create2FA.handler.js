const { query, paramQuery } = rootRequire('commons').DATABASE;
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

async function logic({ body, context, params }) {
    console.log();
    try {
        // await paramQuery('SELECT email FROM "Remittance".admin_user WHERE email=$1', [body.data.email]);


        let secret = speakeasy.generateSecret({ length: 20 });
        await paramQuery('UPDATE "Remittance".admin_user' +
            ' SET "2fa_key"=$1 where email=$2', [secret.base32, body.data.email]);

        let img = await QRCode.toDataURL(secret.otpauth_url);

        return { img: img }


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