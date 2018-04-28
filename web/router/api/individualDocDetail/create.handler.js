const {
    query,
    paramQuery
} = rootRequire('commons').DATABASE;

const {
    multer
} = require('../../../middleware');

async function logic({
    body,
    context,
    params
}) {
    console.log();
    try {


        // id 
        // doc_type 
        // comment
        // doc_detail
        // is_deleted
        // is_verified

        // context.doc_path




        //     let values = [body.data.registration_id, body.data.doc_type, context.doc_path, body.data.is_deleted,
        //         body.data.deleted_on, body.data.deleted_by, body.data.is_verified,
        //         body.data.verified_on, body.data.verified_by, body.data.uploaded_on,
        //         body.data.uploaded_by, body.data.comment, body.data.doc_detail,

        //     ];
        //     let c = await paramQuery('INSERT INTO "Remittance".individual_doc_detail(' +
        //         ' registration_id, doc_type, doc_path, is_deleted, deleted_on,' +
        //         'deleted_by, is_verified, verified_on, verified_by, uploaded_on, ' +
        //         'uploaded_by, comment, doc_detail)' +
        //         'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13)', values);

        //     return c;
        //

        return mock()
    } catch (e) {
        logger.error(e);
        throw e;
    }
}

function mock() {
    let z = Math.floor(Math.random() * 100);
    let y = z % 2;
    let obj = {};
    if (y === 0) {
        obj.msg = "upload successful"
        obj.status = true
    } else {
        obj.msg = "upload unsuccessful",
            obj.status = false
    }
    return obj;
}



function handler(req, res, next) {

    multer.docsMulter(req, res, function (err) {
        if (err) {
            return logger.error("Error uploading file.");
        } else {
            // let m = JSON.stringify(req.body);

            // req.body = JSON.parse(m.slice(0, req.body.length));
            // req.body.data = JSON.parse(req.body.data);


            // console.log("ss", req.body.data, req.body.data.name);

            let doc_path = req.files && req.files.length && req.files[0].path ? req.files[0].path : '';

            req.context = {};
            req.context.doc_path = doc_path;

            logic(req).then(data => {
                    res.json({
                        success: true,
                        data,
                    });
                })
                .catch(err => next(err));
        }
    })
}
module.exports = handler;