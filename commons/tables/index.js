
const tables = {
    payees:'payees',
}
function getTableName (key) {
    return tables[key];
}

module.exports = {
getTableName,
}