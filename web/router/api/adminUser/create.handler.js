const { query, paramQuery, encryptPassword } = rootRequire('commons').DATABASE;
const nodemailer = require('nodemailer');
const config = rootRequire('config').server;
const jwt = require('jsonwebtoken');

async function logic({ body, context, params }) {
    console.log(body.data);
    try {
        let pass = await encryptPassword(body.data.password);

        let values = [body.data.email, pass, body.data.role_id, body.data.created_by,
            body.data.is_Deleted, body.data.modified_by
        ];
        let c = await paramQuery('INSERT INTO "Remittance".admin_user(' +
            'id,email, password, role_id, created_on, created_by, is_deleted, ' +
            'modified_on, modified_by)' +
            ' VALUES ( uuid_generate_v4(),$1, $2, $3,now(), $4, $5, ' +
            'now(), $6)', values);

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