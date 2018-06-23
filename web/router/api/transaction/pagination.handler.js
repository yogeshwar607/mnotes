const Boom = require('boom');
const Joi = require('joi');

const {
    getTableName
} = rootRequire('commons').TABLES;
const {
    getPaginationFilter,
} = rootRequire('commons').UTILS
const tableName = getTableName('transaction');
const payeeTableName = getTableName('payees');

const {
    QueryBuilder,
    database: pg,
} = rootRequire('db');

const columns = {
    full_name: "py.full_name",
    payee_id: "tx.payee_id",
    cust_id: "tx.cust_id",
    transaction_id: "transaction_id",
    transaction_number: "transaction_number",
    from_currency: "from_currency",
    to_currency: "to_currency",
    from_amount: "from_amount",
    to_amount: "to_amount",
    source_of_fund: "source_of_fund",
    reason_for_transfer: "reason_for_transfer",
    status: "status",
    created_on: "tx.created_on",
};


async function logic({
    query,
    params,
    body,
}) {
    try {
        if(false){ // check if customertype is admin/customer
            if (!query.cust_id) return Boom.badRequest(`${'customer'} id is not present`);
        }
        const paginatedObj = getPaginationFilter(body);

        const qb = new QueryBuilder({
            buildTotalQuery: true
        }); // send it true for pagination

        qb.select(columns)
            .selectTotal('count(*)')
            .from(`${tableName} tx`)
            .leftJoin(`${payeeTableName} py`)
            .on(`py.payee_id = tx.payee_id`)

        qb.where(); // 
        if (query.cust_id) qb.and().is(columns.cust_id, query.cust_id); // check here for customer / admin
        if (body.status) qb.and().is(columns.status, body.status);
        if (body.transaction_number) qb.and().is(columns.transaction_number, body.transaction_number);
        if (body.from_currency && body.from_currency != "ALL") {
            qb.and().is(columns.from_currency, body.from_currency)
        };
        if (body.to_currency && body.to_currency != "ALL") {
            qb.and().is(columns.to_currency, body.to_currency)
        };

        if (body.from_date) qb.and().gte(columns.created_on, body.from_date, '::date');
        if (body.to_date) qb.and().lte(columns.created_on, body.to_date, '::date');

        if (body.from_amount) qb.and().gte(columns.from_amount, body.from_amount);


        qb.orderBy(paginatedObj.dbColumnName || columns.transaction_number);
        qb.order('DESC'); // paginatedObj.sortOrder ||

        let x = paginatedObj.skip;
        qb.limit(paginatedObj.limit);
        qb.page(x);
        const result = await qb.paginateQuery(pg);

        return result;
    } catch (e) {
        throw e;
    }
}


function handler(req, res, next) {
    logic(req).then((data) => {
        res.json(data);
    }).catch(err => next(err));
}
module.exports = handler;