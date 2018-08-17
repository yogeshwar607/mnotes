const cuid = require('cuid');
const Boom = require('boom');
const Joi = require('joi');
const {
    getErrorMessages,
} = rootRequire('commons').UTILS;

const {
    foldersJoiSchema
} = rootRequire('commons').SCHEMA;

const {
    notesDAO,
    tagsDAO
} = rootRequire('commons').DAO;

async function logic({
    params,
}) {
    try {
        // create folder id
        const nid = params.id ? params.id : Boom.badRequest("note id not present in params")

        const baseQuery = {};
        baseQuery.nid = nid;

        const _notesDAO = new notesDAO();
        const doc = await _notesDAO.findOne({
            baseQuery
        });
        if (doc) {
            // this is the document getting deleted here
            const tagsArray = doc.ntags;
            tagsArray.map(async(data) => {
                const baseQuery = {};
                baseQuery.tid = data.tid;
                const _tagsDAO = new tagsDAO();
                return await _tagsDAO.remove(baseQuery)
            })
            return await doc.remove()
        };
        
        throw Boom.badRequest("note id not present")
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