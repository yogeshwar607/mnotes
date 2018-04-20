const { query, paramQuery } = rootRequire('commons').DATABASE;

function db_query(vis_completed, vis_cancelled, vis_pending) {
    return 'SELECT * from  "Remittance".get_transaction(' + vis_completed + ',' + vis_cancelled + ',' + vis_pending + ')';
}

async function logic({ context, params }) {
    try {

        let vis_completed = [params.vis_completed];
        let vis_pending = [params.vis_pending];
        let vis_cancelled = [params.vis_cancelled];

        if (vis_completed[0] == undefined) {
            vis_completed[0] = false;
        }
        if (vis_cancelled[0] == undefined) {
            vis_cancelled[0] = false;
        }
        if (vis_pending[0] == undefined) {
            vis_pending[0] = false;
        }

        let c = await paramQuery(db_query(vis_completed, vis_cancelled, vis_pending));

        return c;


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