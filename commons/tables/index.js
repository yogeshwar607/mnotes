
 const schemaName = '"Remittance".'
const tables = {
    transaction:'transaction',
    payees:'payees',
    customer:'customer',
    otp_verification:'otp_verification',
}

function getTableName (key) {
    return `${schemaName}${tables[key]}`;
}

module.exports = {
getTableName,
}