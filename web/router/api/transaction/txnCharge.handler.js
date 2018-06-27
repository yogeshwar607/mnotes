const cuid = require('cuid');
const Joi = require('joi');
const Boom = require('boom');

const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('transaction');

const {
    insert,
    getClient
} = rootRequire('db')
const {
    transactionJoiSchema
} = rootRequire('commons').SCHEMA;

const {
    postgresDateString,
    getErrorMessages
} = rootRequire('commons').UTILS;

async function logic({
    body,
    context,
    params
}) {
    try {

        if (!body.charge) throw Boom.badRequest("charge parameter missing");
        if (!body.currency_pair) throw Boom.badRequest("currency pair corridor parameter missing");

        const charge = body.charge;
        const currencyPair = body.currency_pair;

        // add this charge in redis

        return {
            data: {
                "msg": "charge added/updated successfully"
            }
        }


    } catch (e) {
        logger.error(e);
        throw e;
    } finally {

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