const multer = require('multer');
const path=require('path')  
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './products/')
    },
    filename : (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
});
  
const productsupload = multer(
    { storage: storage ,
    fileFilter:(req,file,cb)=>{
        if(
            file.mimetype=="image/jpeg"||
            file.mimetype=="image/png"||
            file.mimetype=="image/gif"||
            file.mimetype=="image/jpg"
        ){
            cb(null, true)
        }
        else{
            cb(null,false)
            cb(new ERROR("Only jpg,jpeg,png,gfif files allowed"))
        }
    }
 } ).single("myimage");

module.exports = productsupload

