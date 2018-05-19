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
  full_name:"full_name",
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
  query
}) {
  try {
    if (!query.cust_id) return Boom.badRequest(`${'customer'} id is not present`);

    const qb = new QueryBuilder({
      buildTotalQuery: true
    }); // send it true for pagination

    qb.select(columns)
      .selectTotal('count(*)')
      .from(tableName)

    qb.where(); // 
    qb.and().is(columns.cust_id, query.cust_id);
    if(query && query.active != 'all'){
      qb.and().is(columns.is_active,true); // fetch payees which are active by default
    }
    
    qb.orderBy(query.sortColumn || columns.full_name);
    qb.order(query.sortOrder || 'DESC');
    qb.limit(query.limit);
    qb.page(query.page);
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