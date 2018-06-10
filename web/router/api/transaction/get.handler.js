const Boom = require('boom');
const Joi = require('joi');

const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('transaction');
const payeeTableName = getTableName('payees');

const {
    QueryBuilder,
    database: pg,
    query: pgQuery,
} = rootRequire('db');

const columns = {
    full_name: "py.full_name",
    payee_id: "tx.payee_id",
    cust_id: "tx.cust_id",
    transaction_id:"transaction_id",
    transaction_number: "transaction_number",
    from_currency: "from_currency",
    to_currency: "to_currency",
    from_amount: "from_amount",
    to_amount: "to_amount",
    source_of_fund: "source_of_fund",
    reason_for_transfer: "reason_for_transfer",
    status:"status"
};

async function logic({
    query,
    params,
    body,
}) {
    try {
        if (!params.id) return Boom.badRequest(`${'customer'} id is not present`);
        let custId = params.id

        const qb = new QueryBuilder({
            buildTotalQuery: true
        }); // send it true for pagination

        qb.select(columns)
            // .selectTotal('count(*)')
            .from(`${tableName} tx`)
            .leftJoin(`${payeeTableName} py`)
            .on(`py.payee_id = tx.payee_id`)

        qb.where(); // 
        qb.and().is(columns.cust_id, custId); // fetch transactions
        qb.orderBy(columns.transaction_number);
        qb.order('DESC');

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