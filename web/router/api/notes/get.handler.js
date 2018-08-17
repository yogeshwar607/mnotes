const cuid = require('cuid');
const Boom = require('boom');
const Joi = require('joi');
const {
    getErrorMessages,
    getTags
} = rootRequire('commons').UTILS;

const {
    notesJoiSchema
} = rootRequire('commons').SCHEMA;

const {
    notesDAO
} = rootRequire('commons').DAO;

// function to transform data
function enrichNotesObj(data) {
    return {
        nid: data.nid,
        fid: data.fid,
        ntext: data.text
    }
}

async function logic({
    query
}) {
    try {
        const baseQuery = {};

        if (query.fid) {
            baseQuery.fid = query.fid;
        }
        if (query.tag) {
            // element match 
            baseQuery.ntags = {
                $elemMatch: {
                    $eq: query.tag
                }
            };
        }
        const sortQuery = { updated_at:-1 }
        const _notesDAO = new notesDAO();
        const result = await _notesDAO.find({
            baseQuery,
            sortQuery
        });
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