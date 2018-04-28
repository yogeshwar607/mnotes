const {
    query,
    paramQuery,
    encryptPassword
} = rootRequire('commons').DATABASE;
const nodemailer = require('nodemailer');
const config = rootRequire('config').server;
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

async function logic({
    body,
    context,
    params
}) {
    try {
        let password = await encryptPassword(body.password);
        let registrationId = uuidv4();
        let values = [body.email, password, body.source, body.type,
            body.is_email_verified, body.is_otp_verified,
            body.is_transfer_activated,
            body.is_account_blocked, body.is_transaction_blocked,
            body.modified_by, registrationId
        ];
        let c = await paramQuery('INSERT INTO "Remittance".customer(' +
            'email, password, source, type, is_email_verified,' +
            'is_otp_verified, is_transfer_activated, ' +
            'is_account_blocked, is_transaction_blocked, ' +
            'modified_by,registration_id) ' +
            'VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', values);

        await sendMail(body.email);
        let x = mock(registrationId); // mock function to generate values
        return x;
    } catch (e) {
        logger.error(e);
        throw e;
    }
}

function mock(registrationId) {
    let z = Math.floor(Math.random() * 100);  
    let y = z % 2;
    let obj = {};
    if (y === 0) {
        obj.id= registrationId;
    } else {

        let a = Math.floor(Math.random() * 100);  
        let b = a % 2;

        if (b === 0) {
            obj.msg = "email already exists"
            
        } else {
            obj.msg = "mobile number already exists"
        }
    }
    return obj;
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
            user: 'yogeshwar607@gmail.com', // Your email id
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
        from: 'yogeshwar607@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'Remi: Email Verify', // Subject line
        text: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
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