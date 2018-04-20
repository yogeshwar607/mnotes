const assert = require('assert');
// const superagent = require('superagent');
// const request = require('request');

// const constants = rootRequire('commons').CONSTANTS;
// const AppError = rootRequire('commons').ERROR;

// function reutersRate(opts) {
//   if (!(opts.sourceCurrency && opts.destinationCurrency)) {
//     throw new AppError.ValidationError('Source or Destination currency missing');
//   }
//   const currencyPair = `${opts.sourceCurrency}${opts.destinationCurrency}`;
//   const margin = constants.MARGIN;
//   let fxRate;
//   let instaremRate;
//   let destinationAmount = 0;
//   return new Promise((resolve, reject) => {
//     request({
//       headers: {
//         'content-type': 'application/json',
//       },
//       url: constants.REUTERS_TOKEN_URL,
//       qs: {
//         ApplicationID: 'PrajitInstaremCom',
//         Username: 'prajit@instarem.com',
//         Password: 'Instarem123',
//       },
//       method: 'GET',
//     }, (err, response, data) => {
//       if (err) {
//         return reject(err);
//       }
//       const token = JSON.parse(data).CreateServiceToken_Response_1.Token;
//       superagent
//         .post(constants.REUTERS_RATE_URL)
//         .send({
//           RetrieveItem_Request_3: {
//             TrimResponse: false,
//             IncludeChildItemQoS: false,
//             ItemRequest: [{
//               Fields: constants.REUTERS_RATE_FIELDS,
//               RequestKey: [{
//                 Name: constants.CURRENCY_PAIR[currencyPair],
//                 NameType: 'RIC',
//               }],
//               Scope: 'List',
//             }],
//           },
//         })
//         .set('X-Trkd-Auth-ApplicationID', 'PrajitInstaremCom').set('X-Trkd-Auth-Token', token)
//         .set('content-type', 'application/json')
//         .end((reutersErr, _response) => {
//           if (reutersErr) {
//             return reject(reutersErr);
//           }
//           if (_response.body.RetrieveItem_Response_3.ItemResponse[0].Item[0].Fields) {
//             fxRate = _response.body.RetrieveItem_Response_3.ItemResponse[0].Item[0].Fields.Field[6].Double.toFixed(2);
//             instaremRate = (fxRate - (fxRate * (margin / 100))).toFixed(2);
//             if (opts.sourceAmount) {
//               destinationAmount = (instaremRate * Number(opts.sourceAmount)).toFixed(2);
//             }
//             return resolve({ fxRate, instaremRate, margin, destinationAmount });
//           }
//           return reject(new AppError.RemoteCallError('FX Rate is not avaioalble'));
//         });
//     });
//   });
// }

module.exports = (opts) => {
  assert.ok(opts);
  return true || reutersRate(opts);
};