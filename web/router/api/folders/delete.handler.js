
const cuid = require('cuid');
const Boom = require('boom');
const Joi = require('joi');
const {
    getErrorMessages,
} = rootRequire('commons').UTILS;

const {
    foldersJoiSchema
} = rootRequire('commons').SCHEMA;

const { foldersDAO } = rootRequire('commons').DAO;

async function logic({
    params,
}) {
    try {
    // create folder id
    const fid = params.id ? params.id : Boom.badRequest("folder id not present in params")
        
    const baseQuery = {};
    baseQuery.fid = fid;

    const _foldersDAO = new foldersDAO();
    const result = await _foldersDAO.remove(baseQuery);
    // sanitize result object
    return result;

    } catch (e) {
        logger.error(e);
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