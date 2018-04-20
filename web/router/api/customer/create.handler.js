const { query, paramQuery, encryptPassword } = rootRequire('commons').DATABASE;
const nodemailer = require('nodemailer');
const config = rootRequire('config').server;
const jwt = require('jsonwebtoken');

async function logic({ body, context, params }) {
    console.log();
    try {
        let pass = await encryptPassword(body.data.password);

        let values = [body.data.email, pass, body.data.source, body.data.type,
            body.data.is_email_verified, body.data.email_verified_on, body.data.is_otp_verified,
            body.data.otp_verified_on, body.data.is_transfer_activated, body.data.transfer_activated_on,
            body.data.is_account_blocked, body.data.is_transaction_blocked, body.data.last_logged_in,
            body.data.created_on, body.data.modified_on, body.data.modified_by
        ];
        let c = await paramQuery('INSERT INTO "Remittance".customer(' +
            ' email, password, source, type, is_email_verified, ' +
            'email_verified_on, is_otp_verified, otp_verified_on, is_transfer_activated, ' +
            ' transfer_activated_on, is_account_blocked, is_transaction_blocked, ' +
            ' last_logged_in, created_on, modified_on, modified_by) ' +
            'VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)', values);

        await sendMail(body.data.email);
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
async function sendMail(email) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sid.srivastava28@gmail.com', // Your email id
            pass: 'marjavamitjava' // Your password
        }
    });

    const payloads = {
        // token expiry period set for 1 month (Expiry to be set for 1 hour(60 * 60) in production)
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
        sub: email,
    };
    const token = jwt.sign(payloads, config.jwtSecret);

    let text = 'Click on the link to verify: ' + "http://localhost:4700/api/v1/email/verify/" + token;

    let mailOptions = {
        from: 'sid.srivastava28@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'Remi: Email Verify', // Subject line
        text: text
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            // res.json({ yo: 'error' });
        } else {
            console.log('Message sent: ' + info.response);
            return true;
            // res.json({ yo: info.response });
        };
    });


}
module.exports = handler;