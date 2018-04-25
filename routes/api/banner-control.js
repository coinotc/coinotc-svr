
var router = require('express').Router();
var cors = require('cors')
var mongoose = require('mongoose');
var multer = require('multer');
var auth = require('../auth');
var BannerControl = mongoose.model('banner');

const  gstorage = googleStorage({
    projectId: process.env.FIREBASE_PROJECT_ID,
    keyFileName : process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const bucket = gstorage.bucket(process.env.FIREBASE_BUCKET);

const googleMulter = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB
    }
})
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now() + '_' + file.originalname)
    }
  })
var diskUpload = multer({ storage: storage })

router.post('/upload-firestore',googleMulter.single('coverThumbnail'), (req, res)=>{
    console.log('upload here ...');
    console.log(req.file);
    uploadToFireBaseStorage(req.file).then((result=>{
        console.log("firebase stored -> " + result);
        let bannerControl = new BannerControl();
        bannerControl.imgURL = result;
        let error = bannerControl.validateSync();
        if(!error){
            bannerControl.save(function (err, result) {
            })
        }else {
            res.status(500).send(error);
        }
    })).catch((error)=>{
        console.log(error);
    })
    res.status(200).json({});
})


const uploadToFireBaseStorage = function(file) {
    return new Promise((resolve, reject)=>{
        if(!file){
            reject('Invalid file upload');
        }

        let newfileName = `${Date.now()}_${file.originalname}`;
        let fileupload = bucket.file(`banner/${newfileName}`);
        const blobStream = fileupload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });
        blobStream.on('error', (error)=>{
            console.log(error);
            reject('Something went wrong during file upload');
        });

        blobStream.on('finish', ()=>{
            const name = fileupload.name.replace(/\//,'%2F')
            const url = `https://firebasestorage.googleapis.com/v0/b/coinotc-mobile-dev.appspot.com/o/${name}?alt=media`;
            file.fileURL = url;
            resolve(url)
        });
            
        blobStream.end(file.buffer);
    });
}
const apiurl = '/';
router.get(apiurl , (req,res)=>{
    var query ={};
    BannerControl.find( query, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return; 
        }
        res.status(200).json(result);
    });
})

module.exports = router;