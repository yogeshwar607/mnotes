const Boom = require('boom');
const Joi = require('joi');

const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('individual_customer_detail');
const customerTableName = getTableName('customer');
const docTableName = getTableName('individual_doc_detail');

const {
    QueryBuilder,
    database: pg,
} = rootRequire('db');

const columns = {
    email: "cs.email",
    mobile_number: "cs.mobile_number",
    cust_id: "cust_id",
    country_of_residence: "country_of_residence",
    country_of_transaction: "country_of_transaction",
    first_name: "first_name",
    middle_name: "middle_name",
    last_name: "last_name",
    title: "title",
    dob: "dob",
    address_line1: "address_line1",
    address_line2: "address_line2",
    postal_code: "postal_code",
    mobile_number: "mobile_number",
    state: "state",
    city: "city",
    nationality: "nationality",
    employment_status: "employment_status",
    source_of_funds: "source_of_funds",
    is_pep: "is_pep",
    intended_use_of_account: "intended_use_of_account",
    net_worth: "net_worth",
    type_of_industry: "type_of_industry",
    is_dual_citizen: "is_dual_citizen",
};

async function logic({
    context,
    params,
}) {
    try {
        if (!params.id) return Boom.badRequest(`${'customer'} id is not present`);
        let custId = params.id

        const qb = new QueryBuilder({
            buildTotalQuery: false
        }); // send it true for pagination

        qb.select(columns)
            // .selectTotal('count(*)')
            .from(tableName)
            .leftJoin(`${customerTableName} cs`)
            .on('cust_id = cs.registration_id')
        qb.where(); // 
        qb.and().is(columns.cust_id, custId);

        const qb2 = new QueryBuilder({
            buildTotalQuery: false
        }); // send it true for pagination
        qb2.select("*")
            .from(docTableName)
        qb2.where(); // 
        qb2.and().is("cust_id", custId);

       return Promise.all([await qb.query(pg), await qb2.query(pg)])
            .then((results) => {
                if (results.length) {
                    const info = results[0].rows ? results[0].rows : [];
                    const custDocs = results[1] && results[1].rows ? results[1].rows : [];
                    if (info.length) info[0]["docs"] = custDocs;
                    return info
                }
            })
            .catch((err) => {
                logger.error(err);
                throw err;
            })
    } catch (e) {
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