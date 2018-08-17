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
    body,
}) {
    try {
        // create folder id
        const nid = cuid();
        // adding id to body object
        const nObj = Object.assign(body, {
            nid
        });

        // cleaning and transforming object 
        const notesObj = enrichNotesObj(nObj);

        // input validation 
        const {
            error
        } = Joi.validate(notesObj, notesJoiSchema.createSchema);

        if (error) throw Boom.badRequest(getErrorMessages(error));

        // check for tgas in text

        const tagsArray = getTags(notesObj.ntext);

        const tagArr = tagsArray.reduce((arr,ele) => {
            arr.push({
                tid: cuid(),
                tvalue:ele
            })
            return arr;
        },[]);
        
        notesObj['ntags'] = tagArr;

        const _notesDAO = new notesDAO();
        const result = await _notesDAO.save(notesObj);
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