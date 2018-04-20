const { query, paramQuery, encryptPassword } = rootRequire('commons').DATABASE;
const nodemailer = require('nodemailer');
const config = rootRequire('config').server;
const jwt = require('jsonwebtoken');

function db_query(vemail, vpassword, vsource) {
    return 'SELECT * from  "Remittance".signup(\'' + vemail + '\',\'' + vpassword + '\',\'' + vsource + '\')';
}

async function logic({ body, context, params }) {
    console.log();
    try {
        let pass = await encryptPassword(body.data.password);

        let c = await paramQuery(db_query(body.data.email, pass, body.data.source));
        if (c[0].is_success) {
            await sendMail('vaishali@instigence.com', c[0].registration_id);
        }
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

async function sendMail(email, registration_id) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vaishali@instigence.com', // Your email id
            pass: 'VishMaha' // Your password
        }
    });

    const payloads = {
        // token expiry period set for 1 month (Expiry to be set for 1 hour(60 * 60) in production)
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
        sub: registration_id,
    };
    const token = jwt.sign(payloads, config.jwtSecret);

    let text = 'Click on the link to verify: ' + "http://localhost:4700/api/v1/email/verify/" + token;

    let mailOptions = {
        from: 'vaishali@instigence.com', // sender address
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