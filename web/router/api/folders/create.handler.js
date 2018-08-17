
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

// function to transform data
function enrichFolderObj(data){
    return {
        fname:data.name,
        fid:data.fid,
    }
}

async function logic({
    body,
}) {
    try {
    // create folder id
    const fid = cuid();
    // adding id to body object
    const fObj = Object.assign(body,{fid});
    
    // cleaning and transforming object 
    const folderObj = enrichFolderObj(fObj);
    // input validation 
    const {
        error
    } = Joi.validate(folderObj, foldersJoiSchema.createSchema);

    if (error) throw Boom.badRequest(getErrorMessages(error));

    const _foldersDAO = new foldersDAO();
    const result = await _foldersDAO.save(folderObj);
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