const cuid = require('cuid');
const Boom = require('boom');
const Joi = require('joi');
const _ = require('lodash');

const {
    getErrorMessages,
    getTags
} = rootRequire('commons').UTILS;

const {
    tagsJoiSchema
} = rootRequire('commons').SCHEMA;

const {
    tagsDAO
} = rootRequire('commons').DAO;

async function logic({
    query
}) {
    try {
        const baseQuery = {};

        // if user id is present
        if (query.uid) {
            baseQuery.fid = query.fid;
        }
    
        // const queryPipe = [];

        // // sort on updated at 
        // let sortBy = { $sort: { updated_at: -1 } };
        // queryPipe.push(sortBy);

        // let groupBy = { _id: '$tvalue', total: { $sum: 1 } };
        // queryPipe.push({ $group: groupBy });

        const result = await new tagsDAO().find({
           baseQuery:{},
           sortQuery: { tvalue:1 }
        });
       
        let cleanArr = result.map((ele)=>{
            return ele.tvalue;
        })

        // const counts = result.reduce((acc, ele) => {
        //     let value = ele.tvalue;
        //     acc[value] = acc[value] ? acc[value] + 1 : 1;
        //     return acc;
        //   }, Object.create(null));


        // // orderBy count and updated_at
       
        // let groupArr = _.groupBy(result,'tvalue');
       
        // return groupArr;

        return cleanArr;

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