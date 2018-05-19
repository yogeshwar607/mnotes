const Boom = require('boom');

const {
  QueryBuilder,
  database: pg ,
  schemaName
} = rootRequire('db');

const columns = {
  compliance_list_id: 'cl.compliance_list_id',
  remitter_id: 'cl.remitter_id',
  beneficiary_id: 'cl.beneficiary_id',
  type: 'cl.type',
  start_date: 'cl.start_date',
  end_date: 'cl.end_date',
  comment: 'cl.comment',
  country_code: {
    name: 'cn.code',
    format: 'cn.code AS country_code',
  },
  is_active: 'cl.is_active',
  created_at: {
    name: 'cl.created_at',
    format: "to_char(cl.created_at,'dd-mm-YYYY HH:MI:SS') as created_at",
  },
  created_by: {
    name: 'u.full_name',
    format: 'u.full_name AS created_by',
  },
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
      .from(`${schemaName}${tableName}`)
      
    qb.where(); // 
    if (query.entity_type === 'remitter') {
      qb.and().is(columns.remitter_id, +query.id);
    } else if (query.entity_type === 'beneficiary') {
      qb.and().is(columns.beneficiary_id, +query.id);
    }

    qb.orderBy(query.sortColumn || columns.created_at.name);
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