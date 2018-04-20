// // const { Client } = require('pg')

// // const client = new Client({
// //     host: '172.16.0.231',
// //     port: 5433,
// //     user: 'postgres',
// //     password: 'sa@123',
// //     database: "Remittance"
// // })
// // console.log("client");
// // client.connect()
// //     .then(() => console.log('connected'))
// //     .catch(e => console.error('connection error', e.stack))

// // client.query('SELECT Now()')
// //     .then(result => console.log(result))
// //     .catch(e => console.error(e.stack))
// //     .then(() => client.end())
// // client.query('SELECT Now()')
// //     .then(result => console.log(result))
// //     .catch(e => console.error(e.stack))
// //     .then(() => client.end())

// var bcrypt = require('bcrypt');
// const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD1';
// const someOtherPlaintextPassword = 'not_bacon';
// let hasha;
// // bcrypt.genSalt(saltRounds, function(err, salt) {
// //     bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
// //         console.log(hash);
// //         hasha = hash;
// //     });
// // });

// bcrypt.compare(myPlaintextPassword, "$2a$10$E1iVPOaVmRjrWEHhl1UcGeKyjDDnNpoUIlgFLc/q4Nck6RaZui5BG", function(err, res) {
//     console.log("res hash compare", res);
// });

var speakeasy = require('speakeasy');
var QRCode = require('qrcode');

var secret = 'GVFS6SDHOEWCGL22HZXUO3TPGIWDOLDU';
var otoUrl = "otpauth://totp/SecretKey?secret=GVFS6SDHOEWCGL22HZXUO3TPGIWDOLDU";
// console.log(secret.base32, secret.otpauth_url);

// QRCode.toDataURL(otoUrl, function(err, image_data) {
//     console.log(image_data); // A data URI for the QR code image
// });
async function sid() {
    let img = await QRCode.toDataURL(otoUrl);

    console.log(img);
}
sid();


// var verified = speakeasy.totp.verify({
//     secret: secret,
//     encoding: 'base32',
//     token: "286442"
// });
// console.log(verified);