const Boom = require('boom');
const Joi = require('joi');

const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('customer');
const {
    getPaginationFilter,
} = rootRequire('commons').UTILS

const {
    QueryBuilder,
    database: pg,
} = rootRequire('db');

const columns = {
    registration_id: "registration_id",
    email: "email",
    type: "type",
    is_transfer_activated: "is_transfer_activated",
};

async function logic({
    query,
    params,
    body,
    contex,
}) {
    try {

        const filterObj = {}
        if (contex && contex.loginType === "customer") {
            if (!query.registration_id) return Boom.badRequest(`${'customer'} id is not present`);
            filterObj.registration_id = query.registration_id;
        }

        const paginatedObj = getPaginationFilter(body);

        const qb = new QueryBuilder({
            buildTotalQuery: true
        }); // send it true for pagination

        qb.select(columns)
            .selectTotal('count(*)')
            .from(tableName)

        qb.where(); // 
        if (filterObj.registration_id) qb.and().is(columns.registration_id, filterObj.registration_id);

        qb.orderBy(paginatedObj.dbColumnName || columns.email);
        qb.order('DESC'); // paginatedObj.sortOrder ||

        qb.limit(paginatedObj.limit);
        qb.page(paginatedObj.skip);
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