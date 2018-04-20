const { query, paramQuery } = rootRequire('commons').DATABASE;
const multer = require("multer");


function db_query(obj) {
    return 'SELECT * from  "Remittance".individual_doc_update(\'' +
        obj.vregistration_id + '\',\'' + obj.vdoc_type + '\',\'' + obj.vdoc_path + '\',\'' + obj.vuploaded_on +
        '\',\'' + obj.vuploaded_by + '\',\'["' + obj.vdoc_detail + '"]\',\'["' + obj.vcomment + '"]\')';
}

async function logic({ body, context, params }) {
    console.log();
    try {

        let obj = {
            "vregistration_id": body.data.vregistration_id,
            "vdoc_type": body.data.vdoc_type,
            "vdoc_path": context.doc_path,
            "vuploaded_on": body.data.vuploaded_on,
            "vuploaded_by": body.data.vuploaded_by,
            "vdoc_detail": body.data.vdoc_detail,
            "vcomment": body.data.vcomment
        };
        console.log(db_query(obj));
        let c = await paramQuery(db_query(obj));

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
            callback(null, file.originalname);
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