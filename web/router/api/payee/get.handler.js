const Boom = require('boom');
const Joi = require('joi');

const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('payees');

const {
    QueryBuilder,
    database: pg,
} = rootRequire('db');

const columns = {
    payee_id: "payee_id",
    cust_id: "cust_id",
    alias: "alias",
    full_name: "full_name",
    company_name: "company_name",
    is_active: "is_active",
    is_company_payee: "is_company_payee",
    account_number: "account_number",
    bank_name: "bank_name",
    routing_code_type_1: "routing_code_type_1",
    routing_code_value_1: "routing_code_value_1",
    routing_code_type_2: "routing_code_type_2",
    routing_code_value_2: "routing_code_value_2",
    routing_code_type_3: "routing_code_type_3",
    routing_code_value_3: "routing_code_value_3"
};

async function logic({
    params,
    query,
}) {
    try {
        const payee_id = params.id;
        if (!payee_id) return Boom.badRequest(`${'payee'} id is not present`);
        const qb = new QueryBuilder({
            buildTotalQuery: false
        }); // send it true for pagination

        qb.select(columns)
            .from(tableName)
        qb.where(); // 
        qb.and().is(columns.payee_id, payee_id);

        const result = await qb.findOne(pg);
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