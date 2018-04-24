
var router = require('express').Router();
var cors = require('cors')
var mongoose = require('mongoose');
var multer = require('multer');
var auth = require('../auth');

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

router.post('/upload-firestore', auth.required, googleMulter.single('coverThumbnail'), (req, res)=>{
    console.log('upload here ...');
    console.log(req.file);
    console.log(req)
    uploadToFireBaseStorage(req.file).then((result=>{
        console.log("firebase stored -> " + result);
        // saveOneGallery([req.file.originalname, result, req.body.remarks]).then((result)=>{
        //     console.log(result);
        // }).catch((error)=>{
        //     console.log("error ->" + error);
        // })
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
        let fileupload = bucket.file(newfileName);
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
            console.log(fileupload.name);
            //https://firebasestorage.googleapis.com/v0/b/coinotc-kitchensink-banner.appspot.com/o/banner-control%2F2.jpg?alt=media&token=d34df744-5988-44f6-b3fc-982a6522fb70
            const url = `https://firebasestorage.googleapis.com/v0/b/coinotc-kitchensink-banner.appspot.com/o/${fileupload.name}?alt=media`;
            file.fileURL = url;
            resolve(url)
        });
            
        blobStream.end(file.buffer);
    });
}

module.exports = router;