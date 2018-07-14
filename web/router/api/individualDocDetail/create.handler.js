const {
    query,
    paramQuery
} = rootRequire('commons').DATABASE;

const {
    multer
} = require('../../../middleware');

const cuid = require('cuid');
const Joi = require('joi');
const Boom = require('boom');

const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('individual_doc_detail');

const {
    insert,
} = rootRequire('db')

const {
    docJoiSchema
} = rootRequire('commons').SCHEMA;

const {
    trimObject,
    getErrorMessages,
    getFullName,
    postgresDateString
} = rootRequire('commons').UTILS;

function enrichdocDetailObj(body) {
    return {
        cust_id: body.cust_id,
        doc_type: body.doc_type,
        transaction_id: body.transaction_id,
        doc_path: body.doc_path,
        uploaded_on: postgresDateString(new Date()),
        uploaded_by: body.cust_id,
        comment: {
            comment: body.comment
        },
        doc_detail: {
            detail: body.doc_detail
        },
    }
}

async function logic({
    body,
    context,
    params
}) {
    try {
        let docPath = context.doc_path;
        body['doc_path'] = docPath;

        // cleaning object 
        const docDetailObj = trimObject(enrichdocDetailObj(body));
        const {
            error
        } = Joi.validate(docDetailObj, docJoiSchema.createDocSchema, {
            abortEarly: false
        });

        if (error) throw Boom.badRequest(getErrorMessages(error));

        /** Inserting the data into payee table */
        const {
            rows: doc
        } = await insert({
            tableName: tableName,
            data: docDetailObj,
            returnClause: ['doc_id'],
        });
        return doc;
    } catch (e) {
        logger.error(e);
        throw e;
    } finally {

    }
}

function handler(req, res, next) {

    multer.docsMulter(req, res, (err) => {
        if (err) throw Boom.badRequest(getErrorMessages(err));

            let doc_path = req.files && req.files.length && req.files[0].path ? req.files[0].path : '';
            let is_file_received = false;
            if (req.files && req.files.length) {
                is_file_received = true;
            }
            req.context = {};
            req.context.doc_path = doc_path || '';

            logic(req).then(data => {
                    data['is_file_received'] = is_file_received;
                    res.json({
                        success: true,
                        data,
                    });
                })
                .catch(err => next(err));
    })
}
module.exports = handler;