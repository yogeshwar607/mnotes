const { query, paramQuery } = rootRequire('commons').DATABASE;
const oxr = require('open-exchange-rates');
const fx = require('money');
const { fxappid } = rootRequire('config').server;

async function logic({ context, params }) {
    try {

        //Set app id
        oxr.set({ app_id: fxappid })
        let c = 0;
        oxr.latest(async function() {
            // Apply exchange rates and base rate to `fx` library object:
            fx.rates = oxr.rates;
            fx.base = oxr.base;
            // money.js is ready to use:            
            let c = fx(1).from('HKD').to('GBP'); // ~8.0424  
            console.log(c);
        });

        //c = 1;
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