const multer = require('multer');
const cuid = require('cuid');

const docstorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/documents');
  },
  filename(req, file, cb) {
    const fileNameArr = file.originalname.split('.');
    const fileExtension = fileNameArr.pop();
    const originalname = file.originalname.split('.')[0];
    const filename = [cuid(), fileExtension].join('.');
    cb(null, filename);
  },
});


const fileFilter = function (req, file, cb) {
  cb(null, true);
};


const docsMulter = multer({
  storage: docstorage,
  fileFilter: fileFilter,
}).any();


module.exports = { docsMulter };