
var router = require('express').Router();
var cors = require('cors')
var mongoose = require('mongoose');
var multer = require('multer');
//var DIR = './uploads/';
var fs = require('fs');
var Upload = mongoose.model('upload');
// router.use(multer({ dest: './uploads/',
//   rename: function (fieldname, filename) {
//     return filename;
//   },
//  }));
//var upload = multer({dest: DIR}).single('photo');
//router.options('/', cors()) 
// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Express' });
// });
router.options('', cors()) 
router.post('/', function (req, res, next) {
//     var path = '';
//     upload(req, res, function (err) {
//        if (err) {
//          // An error occurred when uploading
//          console.log(err);
//          return res.status(422).send("an Error occured")
//        }  
//       // No error occured.
//        path = req.file.path;
//        console.log(path)
//        return res.send("Upload Completed for "+path); 
//  });     
var newItem = new Upload;
 newItem.img.data = fs.readFileSync(req.files.userPhoto.path)
 newItem.img.contentType = 'image/png';
 newItem.save();
})
module.exports = router;