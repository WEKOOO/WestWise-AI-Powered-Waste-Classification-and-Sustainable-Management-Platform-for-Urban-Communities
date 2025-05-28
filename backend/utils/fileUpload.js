const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: "./uploads/", // Create an uploads folder in the root directory
  filename: function(req, file, cb){
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 10000000}, // Limit file size to 10MB
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
});

// Check file type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb("Error: Images Only!");
  }
}

// Create uploads directory if it doesn't exist
const fs = require("fs");
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}


module.exports = upload;

