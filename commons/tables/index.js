
 const schemaName = '"public".'
const tables = {
    
}

function getTableName (key) {
    return `${schemaName}${tables[key]}`;
}

module.exports = {
getTableName,
}