const { query, paramQuery, decryptComparePassword } = rootRequire('commons').DATABASE;
const jwt = require('jsonwebtoken');
const { jwtSecret } = rootRequire('config').server;

async function logic({ body, context, params }) {
    try {

        console.log(body.data)
        let c = await paramQuery('SELECT id, email, password,is_2fa_enabled' +
            ' FROM "Remittance".admin_user WHERE email=$1', [body.data.email]);

        if (c.length === 0) {
            return { msg: "Invalid Email Or Password" }
        } else if (c.length !== 0) {
            let f = await decryptComparePassword(body.data.password, c[0].password);
            if (!f) {
                return { msg: "Invalid Email Or Password" }
            } else {

                const payloads = {
                    // token expiry period set for 1 month (Expiry to be set for 1 hour(60 * 60) in production)
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
                    sub: {
                        id: c[0].id,
                        loginType: "admin"
                    }
                };
                const token = jwt.sign(payloads, jwtSecret);

                return { user: c, token: token };
            }
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