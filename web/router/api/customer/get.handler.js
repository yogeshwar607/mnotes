const { query, paramQuery } = rootRequire('commons').DATABASE;

async function logic({ context, params }) {
    try {

        let c = await query('SELECT registration_id, email, password, source, type,' +
            'is_email_verified,' +
            'email_verified_on, is_otp_verified, otp_verified_on, is_transfer_activated,' +
            'transfer_activated_on, is_account_blocked, is_transaction_blocked, ' +
            'last_logged_in, created_on, modified_on, modified_by' +
            ' FROM "Remittance".customer');

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