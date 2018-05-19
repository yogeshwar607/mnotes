
 const schemaName = '"Remittance".'
const tables = {
    payees:'payees',
}

function getTableName (key) {
    return `${schemaName}${tables[key]}`;
}

module.exports = {
getTableName,
}