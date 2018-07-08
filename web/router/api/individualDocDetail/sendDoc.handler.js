const Boom = require('boom');
const Joi = require('joi');
const parseUrl = require('parseurl');
const send = require('send');

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
    doc_type:"doc_type",
    doc_path:"doc_path",
};

async function logic({
    query,
    params,
    body,
}) {
    try {
        if (!params.id) return Boom.badRequest(`${'document'} id is not present`);
        let docId = params.id
        // find document and read it and send it

       
    } catch (e) {
        throw e;
    }
}

function handler(req, res, next) {
    let path = req.query && req.query.path ? req.query.path:'';
    send(req, path).pipe(res);
}
module.exports = handler;