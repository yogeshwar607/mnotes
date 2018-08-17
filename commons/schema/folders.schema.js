
const Joi = require('joi');

const createSchema = Joi.object().keys({
    fid: Joi.string().optional(),
    fname:Joi.string().required(),
});


module.exports = {
    createSchema,
};