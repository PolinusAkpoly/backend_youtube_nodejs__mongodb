const multer = require('multer');
const util = require("util");
const path = require("path");

// const MIME_TYPES = {
//     'image/jpg': 'jpg',
//     'image/jpeg': 'jpg',
//     'image/png': 'png'
// }

const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, 'public/assets/files');
    },
    filename: (req, file, callback)=>{
        var name = Math.floor(Math.random() * Math.floor(152524521325)).toString();
        name += Math.floor(Math.random() * Math.floor(1552252325)).toString();
        name += Math.floor(Math.random() * Math.floor(85455458652325)).toString();
        name += Math.floor(Math.random() * Math.floor(8544652325)).toString();
        name += Date.now()+".";

        console.log(file);
        const extension = file.originalname.split('.').pop();
        name += extension;

        callback(null, name);
    }
})

var uploadFiles = multer({ storage: storage }).array("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;