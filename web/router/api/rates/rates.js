const Boom = require('boom');
const {
  reutersRate
} = rootRequire('service');
const constants = rootRequire('constants');

// function to filter reuters result array
function filterReutersResultArray(reutersResult) {
  const filteredObject = reutersResult.reduce((rateObj, val) => {
    const sourceCurrency = val.RequestKey && val.RequestKey.Name ? (val.RequestKey.Name).substr(0, 3) : '';
    const scalingFactor = val.Fields && val.Fields.Field[0] && val.Fields.Field[0].Utf8String ? val.Fields.Field[0].Utf8String : 1;
    const destinationCurrencyRate = val.Fields && val.Fields.Field[1] && val.Fields.Field[1].Double ? val.Fields.Field[1].Double : 0;
    const destinationCurrency = val.Fields && val.Fields.Field[3] && val.Fields.Field[3].Utf8String ? val.Fields.Field[3].Utf8String : sourceCurrency;
    const calculatedRate = parseFloat((destinationCurrencyRate / scalingFactor).toFixed(8));

    rateObj.push({
      destinationCurrency: destinationCurrency,
      fxRate: calculatedRate,
      sourceCurrency: sourceCurrency === destinationCurrency ? 'USD' : sourceCurrency,
    });
    return rateObj;
  }, []);
  return filteredObject;
}

async function getReutersRate(currencies) {
 try {
  const currenciesLength = currencies.length;
  const currencyPairArray = [];
  for (let i = 0; i < currenciesLength; i += 1) {
    const opts = {
      sourceCurrency: currencies[i].sourceCurrency ? currencies[i].sourceCurrency : 'USD',
      destinationCurrency: currencies[i].destinationCurrency ? currencies[i].destinationCurrency : 'USD',
    };
    const currencyPair = `${opts.sourceCurrency}${opts.destinationCurrency}`;
    const RICPAIR = constants.CURRENCY_PAIR[currencyPair] ? constants.CURRENCY_PAIR[currencyPair] : `${currencyPair}=R`;
    currencyPairArray.push({
      Name: RICPAIR,
      NameType: 'RIC',
    });
  }
  const reutersResult = await reutersRate(currencyPairArray);
  const filteredReutersResult = filterReutersResultArray(reutersResult.ratesArray);
  return filteredReutersResult;
 } catch (e) {
   throw e;
 }
}

async function logic({
  body
}) {
  try {
    const currencyPairArray = body && body.currencyPairs ? body.currencyPairs : [];
    if (!currencyPairArray.length) return Boom.badRequest(`Please send currency pairs in format - [{sourceCurrency:USD,destinationCurrency:EUR}]`);
  
    const reutersRates = await getReutersRate(currencyPairArray);

    return {
      rates: {
        INRSGD: {
          "destinationCurrency": "INR",
          "fxRate": 50.996,
          "sourceCurrency": "SGD"
        },
        SGDINR: {
            destinationCurrency: "SGD",
            fxRate: 0.02,
            sourceCurrency: "INR"
        }
      }
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