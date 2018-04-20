const { query, paramQuery } = rootRequire('commons').DATABASE;

async function logic({ body, context, params }) {
    try {
        let values = [body.data.registration_id, body.data.email, body.data.password, body.data.source, body.data.type,
            body.data.is_email_verified, body.data.email_verified_on, body.data.is_otp_verified,
            body.data.otp_verified_on, body.data.is_transfer_activated, body.data.transfer_activated_on,
            body.data.is_account_blocked, body.data.is_transaction_blocked, body.data.last_logged_in,
            body.data.created_on, body.data.modified_on, body.data.modified_by
        ];
        let c = await paramQuery('UPDATE "Remittance".customer' +
            'SET email=$2, password=$3, source=$4, type=$5, is_email_verified=$6,' +
            'email_verified_on=$7, is_otp_verified=$8, otp_verified_on=$9, is_transfer_activated=$10,' +
            'transfer_activated_on=$11, is_account_blocked=$12, is_transaction_blocked=$13, ' +
            'last_logged_in=$14, created_on=$15, modified_on=$16, modified_by=$17' +
            'WHERE registration_id=$1', values);

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