const { query, paramQuery } = rootRequire('commons').DATABASE;

function db_query(email, role_id) {
    return 'SELECT * from  "Remittance".get_admin_users(\'' + email + '\',' + role_id + ')';
}

let roleQuery = 'SELECT id, role, description,' +
    'created_on, createy_by, is_deleted, modified_on, ' +
    ' modified_by' +
    ' FROM "Remittance".admin_role WHERE is_deleted=false';




async function logic({ context, params }) {
    try {
        let email = [params.email];
        let role_id = [params.role_id];
        if (email[0] == undefined) {
            email[0] = '';
        }
        if (role_id[0] == undefined) {
            role_id[0] = 0;
        }

        let c = await paramQuery(db_query(email, role_id));
        let c1 = await query(roleQuery);
        return { users: c, role: c1 };
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