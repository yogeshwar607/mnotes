const { query, paramQuery } = rootRequire('commons').DATABASE;


function db_query(obj) {

    return 'SELECT * from  "Remittance".set_transaction(' +
        '\'' + obj.vfrom_currency + '\',\'' + obj.vto_currency + '\',' + obj.vfrom_amount +
        ',' + obj.vto_amount + ',' + obj.vfx_rate_offered + ',' + obj.vfx_rate_actual + ',' +
        obj.vfx_rate_bank + ',' + obj.vfees + ',' + obj.vbank_fees + ',' + obj.vdiscount +
        ',\'' + obj.vcoupon_code + '\',' + obj.vbonus + ',' + obj.vsavings + ',' + obj.vis_referral_bonus +
        ',\'' + obj.vreferral_code + '\',\'' + obj.vsource_of_fund + '\',\'' + obj.vsource_of_fund_other_description +
        '\',' + obj.vpayee_id + ',\'' + obj.vreason_for_transfer + '\',\'' + obj.vreason_for_transfer_other_description +
        '\',\'' + obj.vpayment_mode + '\',\'' + obj.vtransaction_created_on + '\',\'' + obj.vpayment_estimated_date +
        '\',' + obj.vis_otp_verified + ')';
}

async function logic({ body, context, params }) {
    try {
        let obj = {
            "vfrom_currency": body.data.vfrom_currency,
            "vto_currency": body.data.vto_currency,
            "vfrom_amount": body.data.vfrom_amount,
            "vto_amount": body.data.vto_amount,
            "vfx_rate_offered": body.data.vfx_rate_offered,
            "vfx_rate_actual": body.data.vfx_rate_actual,
            "vfx_rate_bank": body.data.vfx_rate_bank,
            "vfees": body.data.vfees,
            "vbank_fees": body.data.vbank_fees,
            "vdiscount": body.data.vdiscount,
            "vcoupon_code": body.data.vcoupon_code,
            "vbonus": body.data.vbonus,
            "vsavings": body.data.vsavings,
            "vis_referral_bonus": body.data.vis_referral_bonus,
            "vreferral_code": body.data.vreferral_code,
            "vsource_of_fund": body.data.vsource_of_fund,
            "vsource_of_fund_other_description": body.data.vsource_of_fund_other_description,
            "vpayee_id": body.data.vpayee_id,
            "vreason_for_transfer": body.data.vreason_for_transfer,
            "vreason_for_transfer_other_description": body.data.vreason_for_transfer_other_description,
            "vpayment_mode": body.data.vpayment_mode,
            "vtransaction_created_on": body.data.vtransaction_created_on,
            "vpayment_estimated_date": body.data.vpayment_estimated_date,
            "vis_otp_verified": body.data.vis_otp_verified
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