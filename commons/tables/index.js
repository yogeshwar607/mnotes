
 const schemaName = '"Remittance".'
const tables = {
    payees:'payees',
    customer:'customer',
}

function getTableName (key) {
    return `${schemaName}${tables[key]}`;
}

module.exports = {
getTableName,
}