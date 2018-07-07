const Boom = require('boom');
const Joi = require('joi');

const {
  getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('payees');
const {
  getPaginationFilter,
} = rootRequire('commons').UTILS

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
  query,
  params,
  body,
  context,
}) {
  try {

    const filterObj = {}
    if ( context && context.loginType === "customer") {
      if (!query.cust_id) return Boom.badRequest(`${'customer'} id is not present`);
      filterObj.cust_id = query.cust_id;
    }

    if (query && query.active != 'all') filterObj.active = query.active

    const paginatedObj = getPaginationFilter(body);

    const qb = new QueryBuilder({
      buildTotalQuery: true
    }); // send it true for pagination

    qb.select(columns)
      .selectTotal('count(*)')
      .from(tableName)

    qb.where(); // 
    if (filterObj.cust_id) qb.and().is(columns.cust_id, filterObj.cust_id);
    if (filterObj.active != 'all') qb.and().is(columns.is_active, true); // fetch payees which are active by default


    qb.orderBy(paginatedObj.dbColumnName || columns.full_name);
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