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
    status: "status"
};

function getSortColumnName(columns, order) {
    if (columns && order) {
        return columns[order[0]['column']]['name'];
    }
}

function getSortColumnOrder(order) {
    if (order) {
        return order[0]['dir'] === 'asc' ? 1 : -1;
    }
    // By default sort by updated_at in descending order
    return -1;
}

// fetch data from query string and populate it to pagination filter
function getPaginationFilter(body) {
    const skip = parseInt(body.start, 10) || 0;
    const limit = parseInt(body.length, 10) || 10;
    const draw = parseInt(body.draw, 10);
    const search = body.search;
    const columns = body.columns;
    const order = body.order;
    const dbColumnName = getSortColumnName(columns, order) || body.defaultSortColumn;
    const sortOrder = getSortColumnOrder(order) || body.defaultSortOrder;
    const sort = {};
    sort[dbColumnName] = sortOrder;
    return {
        skip,
        limit,
        sort,
        draw,
        search,
        dbColumnName,
        sortOrder
    };
}

function getNoRecordsObject(query) {
    return {
        draw: parseInt(query.draw, 10),
        recordsFiltered: 0,
        recordsTotal: 0,
        response: [],
    };
}

async function logic({
    query,
    params,
    body,
}) {
    try {
        // if (!query.cust_id) return Boom.badRequest(`${'customer'} id is not present`);
        paginatedObj = getPaginationFilter(body);

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
        if (body.from_currency) qb.and().is(columns.from_currency, body.from_currency);
        if (body.to_currency) qb.and().is(columns.to_currency, body.to_currency);

        if (query.from_date) qb.and().gte(columns.created_at, query.from_date, '::date');
        if (query.to_date) qb.and().lte(columns.created_at, query.to_date, '::date');

        if (body.from_amount) qb.and().gte(columns.from_amount, query.from_amount);


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