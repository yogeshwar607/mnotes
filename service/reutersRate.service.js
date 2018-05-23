const assert = require('assert');
const superagent = require('superagent');
const request = require('request');

const constants = require('../constants');
const AppError = require('../commons').ERROR;

function reutersRate(currencyPairArray) { // [{ Name:'USDINR=X', NameType: 'RIC'}]
  return new Promise((resolve, reject) => {
    return request({
      headers: {
        'content-type': 'application/json',
      },
      url: constants.REUTERS_TOKEN_URL,
      qs: {
        ApplicationID: 'PrajitInstaremCom',
        Username: 'prajit@instarem.com',
        Password: 'Instarem123',
      },
      method: 'GET',
    }, (err, response, data) => {
      if (err) {
        logger.info(err, 'error in fetching reuters token');
        return reject(err);
      }
      let token;
      try {
        const parsedData = data ? JSON.parse(data) : {};
        token = parsedData && parsedData.CreateServiceToken_Response_1 && parsedData.CreateServiceToken_Response_1.Token ? parsedData.CreateServiceToken_Response_1.Token : '';
      } catch (e) {
        throw e;
      }

      return superagent
        .post(constants.REUTERS_RATE_URL)
        .send({
          RetrieveItem_Request_3: {
            TrimResponse: false,
            IncludeChildItemQoS: false,
            ItemRequest: [{
              Fields: constants.REUTERS_RATE_FIELDS,
              RequestKey: currencyPairArray,
              Scope: 'List',
            }],
          },
        })
        .set('X-Trkd-Auth-ApplicationID', 'PrajitInstaremCom').set('X-Trkd-Auth-Token', token)
        .set('content-type', 'application/json')
        .end((reutersErr, _response) => {
          if (reutersErr) {
            return reject(reutersErr);
          }
          if (_response.body.RetrieveItem_Response_3 && _response.body.RetrieveItem_Response_3.ItemResponse[0] && _response.body.RetrieveItem_Response_3.ItemResponse[0].Item) {
            return resolve({ ratesArray: _response.body.RetrieveItem_Response_3.ItemResponse[0].Item });
          }
        });
    });
  });
}

module.exports = (currencyPairArray) => {
  assert.ok(currencyPairArray);
  return reutersRate(currencyPairArray);
};