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
      if (!query.cust_id) return Boom.badRequest(`${'customer'} id is not present`);
      paginatedObj = getPaginationFilter(body);

      const qb = new QueryBuilder({
        buildTotalQuery: true
      }); // send it true for pagination

      qb.select(columns)
        .selectTotal('count(*)')
        .from(tableName)

      qb.where(); // 
      qb.and().is(columns.cust_id, query.cust_id);
      if (query && query.active != 'all') {
        qb.and().is(columns.is_active, true); // fetch payees which are active by default
      }


      qb.orderBy(paginatedObj.dbColumnName || columns.full_name);
      qb.order( 'DESC'); // paginatedObj.sortOrder ||

      let x = paginatedObj.skip ;
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