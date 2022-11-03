const multer = require('multer');
const path=require('path')  
const storage = multer.diskStorage({
    destination: (req, img, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
});
  
const upload = multer({ storage: storage }).single("myimage");

module.exports = upload

