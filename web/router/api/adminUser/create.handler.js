
const cuid = require('cuid');
const {
    insert,
    query: pgQuery,
    encryptPassword
} = rootRequire('db');
const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('admin_user');

async function logic({
    body,
    context,
    params
}) {
    try {
        let password = await encryptPassword(body.password);

        // let values = [body.email, pass, body.role_id, body.created_by,
        //     body.is_deleted, body.modified_by,
        //     cuid()
        // ];
        // let c = await pgQuery('INSERT INTO "Remittance".admin_user(' +
        //     'admin_id,email, password, role_id, created_on, created_by, is_deleted, ' +
        //     'modified_on, modified_by)' +
        //     ' VALUES ( $7,$1, $2, $3,now(), $4, $5, ' +
        //     'now(), $6)', values);
        // return c;
const adminObj = {
    admin_id:cuid(),
    email:body.email,
    password:password
}
  /** Inserting the data into payee table */
  const {
    rows: doc
} = await insert({
    tableName: tableName,
    data: adminObj,
    returnClause: ['admin_id'],
});
return doc;


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