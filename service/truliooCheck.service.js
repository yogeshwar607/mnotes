//const assert = require('assert');
// const superagent = require('superagent');

// const constants = rootRequire('commons').CONSTANTS;
// const AppError = rootRequire('commons').ERROR;

// // TODO: add joi check for firstName and lastName check
// function truliooCheck(opts) {
//   const responseObject = {
//     amlHit: false,
//     amlData: null,
//     amlBody: {},
//   };
//   return new Promise((resolve, reject) => {
//     superagent.get(`${constants.TRULIOO_URL}/${opts.firstName}/${opts.lastName}`)
//       .end((err, res) => {
//         if (err) {
//           logger.error('Trulioo Error while fetching data');
//           // handled error in Trulioo
//           responseObject.amlHit = 'ERROR';
//           responseObject.amlData = err.message;
//           responseObject.amlBody = err;
//           resolve(responseObject);
//           // if (err.timeout) {
//           //   // timeout for our end.
//           //   return reject(new AppError.RemoteRequestTimeOut('Trulioo check, Remote Request Time Out'));
//           // } else if (err.code === 'ENOTFOUND') {
//           //   // TODO: log the err object
//           //   return reject(new AppError.RemoteServiceNotFound('Remote Service Not Available'));
//           // } else if (err.response.status === 500 && err.response != null) {
//           //   return reject(new AppError.RemoteCallError(err.response.text));
//           // } else if (err.status === 401) {
//           //   return reject(new AppError.RemoteServiceNotFound(err.message));
//           // } else {
//           //   return reject(new AppError.RemoteServiceNotFound('Remote Service Not Available'));
//           // }
//         }
//         try {
//           const { Record } = res.body;
//           if (Record) {
//             responseObject.amlBody = Record;

//             Record.DatasourceResults[0].AppendedFields.forEach((v) => {
//               if (v.FieldName === 'WatchlistState') {
//                 logger.debug(`Truiloo ${v.Data} | Name: ${opts.firstName} ${opts.lastName}`);
//                 responseObject.amlHit = v.Data === 'Hit' ? 'HIT' : 'CLEAR';
//               } else if (v.FieldName === 'WatchlistData') {
//                 responseObject.amlData = v.Data;
//               }
//             });
//             resolve(responseObject);
//           }
//         } catch (e) {
//           logger.error('Trulioo Error while parsing data');
//           // handled error in Trulioo
//           responseObject.amlHit = 'ERROR';
//           responseObject.amlData = e.message;
//           responseObject.amlBody = e;
//           resolve(responseObject);
//         }
//       });
//   });
// }


module.exports = (opts) => {
  assert.ok(opts);
  return true ||  truliooCheck(opts);
};

/*
 * Trulioo Response:
{
  "TransactionID": "e80f15b9-7890-46a6-b5f9-f3bf3c9f220d",
  "UploadedDt": "2017-03-09T12:32:20",
  "Record": {
    "TransactionRecordID": "812b5a59-7bad-4f15-96eb-50e20bc86cb9",
    "RecordStatus": "nomatch",
    "DatasourceResults": [{
      "DatasourceName": "International Watchlist",
      "DatasourceFields": [{
          "FieldName": "FirstSurName",
          "Status": "match"
        },
        {
          "FieldName": "FirstGivenName",
          "Status": "match"
        }
      ],
      "AppendedFields": [{
          "FieldName": "WatchlistState",
          "Data": "Hit"
        },
        {
          "FieldName": "WatchlistData",
          "Data": "Specially Designated Nationals List|http://www.treasury.gov/resource-center/sanctions/SDN-List/Pages/default.aspx\tConsolidated list of persons, groups and entities subject to EU financial sanctions|http://ec.europa.eu/external_relations/cfsp/sanctions/list/version4/global/global.xml\tDFAT - Consolidated list|http://www.dfat.gov.au/icat/UNSC_financial_sanctions.html\tExport.gov Consolidated list|http://2016.export.gov/ecr/eg_main_023148.asp\tThe Office of the Superintendent of Financial Institutions Canada|http://www.osfi-bsif.gc.ca/Eng/fi-if/amlc-clrpc/atf-fat/Pages/default.aspx\tHM-Treasury Consolidated list of financial sanctions targets|http://www.hm-treasury.gov.uk/fin_sanctions_index.htm"
        }
      ],
      "Errors": [],
      "FieldGroups": []
    }],
    "Errors": []
  },
  "Errors": []
}
 *
 */