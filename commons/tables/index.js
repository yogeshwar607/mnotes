
 const schemaName = '"Remittance".'
const tables = {
    transaction:'transaction',
    payees:'payees',
    customer:'customer',
    individual_customer_detail:'individual_customer_detail',
    otp_verification:'otp_verification',
    email_verification:'email_verification',
    individual_doc_detail:'individual_doc_detail',
    customer_state:'customer_state'
}

function getTableName (key) {
    return `${schemaName}${tables[key]}`;
}

module.exports = {
getTableName,
}