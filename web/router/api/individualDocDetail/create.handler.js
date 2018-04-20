const { query, paramQuery } = rootRequire('commons').DATABASE;

async function logic({ body, context, params }) {
    console.log();
    try {
        let values = [body.data.registration_id, body.data.doc_type, context.doc_path, body.data.is_deleted,
            body.data.deleted_on, body.data.deleted_by, body.data.is_verified,
            body.data.verified_on, body.data.verified_by, body.data.uploaded_on,
            body.data.uploaded_by, body.data.comment, body.data.doc_detail,

        ];
        let c = await paramQuery('INSERT INTO "Remittance".individual_doc_detail(' +
            ' registration_id, doc_type, doc_path, is_deleted, deleted_on,' +
            'deleted_by, is_verified, verified_on, verified_by, uploaded_on, ' +
            'uploaded_by, comment, doc_detail)' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13)', values);

        return c;
    } catch (e) {
        logger.error(e);
        throw e;
    }
}

function handler(req, res, next) {

    const storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, './uploads/documents/');
        },
        filename: function(req, file, callback) {
            callback(null, uuid.v4() + file.originalname.slice(file.originalname.lastIndexOf(".")));
        }
    });

    const upload = multer({
        storage: storage,
        fileFilter: function(req, file, callback) {

            callback(null, true)
        }
    }).array('doc', 1);

    upload(req, res, function(err) {
        if (err) {
            return logger.error("Error uploading file.");
        } else {

            let m = JSON.stringify(req.body);

            req.body = JSON.parse(m.slice(0, req.body.length));
            req.body.data = JSON.parse(req.body.data);


            console.log("ss", req.body.data, req.body.data.name);

            let doc_path = req.files[0].path;

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
    });
}
module.exports = handler;