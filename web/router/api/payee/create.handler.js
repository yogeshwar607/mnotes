const { query, paramQuery } = rootRequire('commons').DATABASE;


function db_query(obj) {
    return 'SELECT * from  "Remittance".create_payee(' +
        obj.vis_company_payee + ',\'' + obj.vtitle +
        '\',\'' + obj.vfirst_name + '\',\'' + obj.vmiddle_name + '\',\'' + obj.vlast_name + '\',\'' + obj.vemail +
        '\',\'' + obj.vcountry + '\',\'' + obj.vstate + '\',\'' + obj.vcity + '\',\'' + obj.vstreet_address +
        '\',\'' + obj.vpostal_code + '\',\'' + obj.vmobile_country_code + '\',\'' + obj.vmobile +
        '\',\'' + obj.vrelationship + '\',\'' + obj.vbank_code + '\',\'' + obj.vbank + '\',\'' + obj.vaccount_number +
        '\',\'' + obj.vcreated_on + '\',\'' + obj.vcust_regi_id + '\')';
}


async function logic({ body, context, params }) {
    try {
        let obj = {
            "vis_company_payee": body.data.vis_company_payee,
            "vtitle": body.data.vtitle,
            "vfirst_name": body.data.vfirst_name,
            "vmiddle_name": body.data.vmiddle_name,
            "vlast_name": body.data.vlast_name,
            "vemail": body.data.vemail,
            "vcountry": body.data.vcountry,
            "vstate": body.data.vstate,
            "vcity": body.data.vcity,
            "vstreet_address": body.data.vstreet_address,
            "vpostal_code": body.data.vpostal_code,
            "vmobile_country_code": body.data.vmobile_country_code,
            "vmobile": body.data.vmobile,
            "vrelationship": body.data.vrelationship,
            "vbank_code": body.data.vbank_code,
            "vbank": body.data.vbank,
            "vaccount_number": body.data.vaccount_number,
            "vcreated_on": body.data.vcreated_on,
            "vcust_regi_id": body.data.vcust_regi_id
        };

        let c = await paramQuery(db_query(obj));
        return c;
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