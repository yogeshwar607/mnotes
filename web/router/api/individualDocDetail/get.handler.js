const Boom = require('boom');
const Joi = require('joi');

const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('individual_doc_detail');

const {
    QueryBuilder,
    database: pg,
    query: pgQuery,
} = rootRequire('db');

const columns = {
    doc_id: "doc_id",
    cust_id: "cust_id",
    doc_type:"doc_type"
};

async function logic({
    query,
    params,
    body,
}) {
    try {
        if (!params.id) return Boom.badRequest(`${'document'} id is not present`);
        let docId = params.id
        
        const qb = new QueryBuilder({
            buildTotalQuery: true
        }); // send it true for pagination

        qb.select(columns)
           // .selectTotal('count(*)')
            .from(tableName)

        qb.where(); // 
        qb.and().is(columns.doc_id, docId);
        qb.orderBy(columns.doc_type);
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
    logic(req)
        .then(data => {
            res.json({
                success: true,
                data,
            });
        })
        .catch(err => next(err));
}
module.exports = handler;