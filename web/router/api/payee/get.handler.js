const Boom = require('boom');
const Joi = require('joi');

const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('payees');

const {
    QueryBuilder,
    database: pg,
    query: pgQuery,
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
    query,
    params,
    body,
}) {
    try {
        if (!params.id) return Boom.badRequest(`${'customer'} id is not present`);
        let custId = params.id
        // let values = [custId, true];
        // const text = 'SELECT * FROM "Remittance".payees where cust_id = $1 AND is_active = $2  ORDER BY full_name DESC';
        // const {
        //     rows: result
        // } = await pgQuery(text, values);
        // return result;

        const qb = new QueryBuilder({
            buildTotalQuery: true
        }); // send it true for pagination

        qb.select(columns)
            .selectTotal('count(*)')
            .from(tableName)

        qb.where(); // 
        qb.and().is(columns.cust_id, custId);
        qb.and().is(columns.is_active, true); // fetch payees which are active by default

        qb.orderBy(columns.full_name);
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
    logic(req).then((data) => {
        res.json(data);
    }).catch(err => next(err));
}
module.exports = handler;