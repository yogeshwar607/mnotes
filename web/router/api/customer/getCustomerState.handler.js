const Boom = require('boom');

const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('customer_state');

const {
    QueryBuilder,
    database: pg,
} = rootRequire('db');

async function logic({
    params,
}) {
    try {
        if (!params.id) return Boom.badRequest(`${'customer'} id is not present`);
        let custId = params.id
        
        const qb = new QueryBuilder({
            buildTotalQuery: false
        }); // send it true for pagination

        qb.select('*')
           // .selectTotal('count(*)')
            .from(tableName)

        qb.where(); // 
        qb.and().is('cust_id', custId);
       
        const {
            rows: result
        } = await qb.query(pg);

        return result;
    } catch (e) {
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