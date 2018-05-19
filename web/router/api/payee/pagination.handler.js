const Boom = require('boom');
const Joi = require('joi');

const { getTableName} = rootRequire('commons').TABLES;
const tableName = getTableName('payees');

const {
  QueryBuilder,
  database: pg ,
  schemaName
} = rootRequire('db');

const columns = {
  cust_id:'cust_id',
  full_name:'full_name',
  payee_id:'payee_id',
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