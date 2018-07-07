const {
    QueryBuilder,
    database: pg,
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
        qb.select({"email": "email"})
                .from(tableName)

                qb.where(); // 
                qb.and().is("email", email);

                const {
                    rows: result
                } = await qb.query(pg);

                if (result.length === 0) {
                    return {
                        msg: "invalid email"
                    }
                } else if (result[0].is_email_verified !== true) {
                    return {
                        msg: "email not verified"
                    }
                } else if (result.length !== 0) {
                    return {
                        msg: "Please check your email for further instructions"
                    }
                }
            }
            catch (e) {
                logger.error(e);
                throw e;
            } finally {

            }
        }

        function handler(req, res, next) {

            logic(req)
                .then(data => {
                    // res.json({
                    //     success: true,
                    //     data,
                    // });
                    res.status(301).redirect("http://www.xwapp.com")

                })
                .catch(err => next(err));
        }
        module.exports = handler;