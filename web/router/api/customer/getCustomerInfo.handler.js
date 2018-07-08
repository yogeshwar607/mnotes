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
    cust_id: "doc.cust_id",
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
    doc_id: "doc_id",
    doc_type: "doc_type",
    doc_path: "doc_path",

};

async function logic({
    query,
    params,
    body,
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
            .leftJoin(`${docTableName} doc`)
            .on('doc.cust_id = cs.registration_id')

        qb.where(); // 
        qb.and().is(columns.cust_id, custId);

        const {
            rows: result
        } = await qb.query(pg);
        let docArray = [];
        result.map((ele) => {
            docArray.push({
                doc_id: ele.doc_id,
                doc_path: ele.doc_path,
                doc_type: ele.doc_type
            })
        })
        let res  = result[0];
        res["docs"] = docArray;
        return [res];
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