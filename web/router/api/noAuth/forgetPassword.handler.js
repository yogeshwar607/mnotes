const {
    QueryBuilder,
    database: pg,
    query: pgQuery,
} = rootRequire('db');

const {
    getTableName
} = rootRequire('commons').TABLES;
const tableName = getTableName('customer');

async function logic({
    params
}) {
    try {
        // validate this token as same to otp validation
        const email = params.id;
        if (!email) throw Boom.badRequest('Please provide email id');

        const qb = new QueryBuilder({
            buildTotalQuery: false
        });
        qb.select({
                "email": "email",
                "is_email_verified":"is_email_verified"
            })
            .from(tableName)

        qb.where(); // 
        qb.and().is("email", email);

        const {
            rows: result
        } = await qb.query(pg);

        if (result.length === 0) {
            return {
                msg: "invalid email",
                is_email_sent:false
            }
        } else if ((result[0].is_email_verified ? result[0].is_email_verified:false) !== true) {
            return {
                msg: "email not verified, please verify your email first",
                is_email_sent:false
            }
        } else if (result.length !== 0) {
            return {
                msg: "Please check your email for password",
                is_email_sent:true
            }
        }
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