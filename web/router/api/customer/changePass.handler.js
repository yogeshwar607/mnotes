const Boom = require('boom');

const {
    query: pgQuery,
    decryptComparePassword,
    encryptPassword,
} = rootRequire('db');


async function logic({
    body,
    context,
    params
}) {
    try {
        if (!body.oldPassword) throw Boom.badRequest("old password not provided");
        if (!body.newPassword) throw Boom.badRequest("new password not provided");
        if (body.oldPassword === body.newPassword) throw Boom.badRequest("password cannot be same");
        let oldPass = body.oldPassword;
        let newPass = await encryptPassword(body.newPassword);

        // fetch old password hash,
        const {
            rows
        } = await pgQuery('SELECT "Remittance".get_password($1)', [context.id]);
        const passHash = rows.length && rows[0].get_password ? rows[0].get_password : "";

        // compare it with pass
        const compareResult = await decryptComparePassword(oldPass, passHash);
        if (!compareResult) throw Boom.badRequest("invalid old password");

        // update new password
        const {
            rows: result
        } = await pgQuery('SELECT "Remittance".change_password($1,$2)', [context.id, newPass]);

        return {
            "msg": result[0].change_password
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