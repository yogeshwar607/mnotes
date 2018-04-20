const { query, paramQuery } = rootRequire('commons').DATABASE;

function db_query(obj) {
    return 'SELECT * from  "Remittance".individual_detail_update(\'' +
        obj.vregistration_id + '\',\'' + obj.vcountry_of_residence + '\',\'' + obj.vcountry_of_transaction +
        '\',\'' + obj.vfirst_name + '\',\'' + obj.vmiddle_name + '\',\'' + obj.vlast_name + '\',\'' + obj.vtitle + '\',\'' + obj.vdob +
        '\',\'' + obj.vaddress_line1 + '\',\'' + obj.vaddress_line2 + '\',\'' + obj.vpostal_code + '\',\'' + obj.vmobile_country_code +
        '\',\'' + obj.vmobile_no + '\',\'' + obj.vstate + '\',\'' + obj.vcity + '\',\'' + obj.vnationality +
        '\',\'' + obj.vemployment_status + '\',\'' + obj.vsource_of_funds + '\',' + obj.vis_pep +
        ',\'' + obj.vintended_use_of_account + '\',\'' + obj.vnet_worth + '\',\'' + obj.vtype_of_industry +
        '\',' + obj.vis_dual_citizen + ',\'' + obj.vmodified_on + '\',\'' + obj.vmodified_on + '\',\'' + obj.vmodified_by + '\')';
}

async function logic({ body, context, params }) {
    try {

        let obj = {
            "vregistration_id": body.data.vregistration_id,
            "vcountry_of_residence": body.data.vcountry_of_residence,
            "vcountry_of_transaction": body.data.vcountry_of_transaction,
            "vfirst_name": body.data.vfirst_name,
            "vmiddle_name": body.data.vmiddle_name,
            "vlast_name": body.data.vlast_name,
            "vtitle": body.data.vtitle,
            "vdob": body.data.vdob,
            "vaddress_line1": body.data.vaddress_line1,
            "vaddress_line2": body.data.vaddress_line2,
            "vpostal_code": body.data.vpostal_code,
            "vmobile_country_code": body.data.vmobile_country_code,
            "vmobile_no": body.data.vmobile_no,
            "vstate": body.data.vstate,
            "vcity": body.data.vcity,
            "vnationality": body.data.vnationality,
            "vemployment_status": body.data.vemployment_status,
            "vsource_of_funds": body.data.vsource_of_funds,
            "vis_pep": body.data.vis_pep,
            "vintended_use_of_account": body.data.vintended_use_of_account,
            "vtype_of_industry": body.data.vtype_of_industry,
            "vis_dual_citizen": body.data.vis_dual_citizen,
            "vmodified_on": body.data.vmodified_on,
            "vmodified_by": body.data.vmodified_by
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