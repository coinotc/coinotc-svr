var router = require('express').Router();
var speakeasy = require("speakeasy");
var mongoose = require('mongoose');
// var QRCode = require('qrcode');
var User = mongoose.model('User');
var auth = require('../auth');

const api = '/'

router.get(api, auth.required, (req, res) => {
    let user = req.query;
    if (user) {
        User.findOne({ username: user.username }, (err, result) => {
            let secret = speakeasy.generateSecret({ length: 10, name: `Coinotc (${result.email})` });
            User.findOneAndUpdate({ username: user.username }, {
                tfa: { effective: false, secret: secret }
            }, (err, result) => {
                if (!err)
                    res.status(201).json(secret.base32);
                //res.send(secret.base32);
                //     QRCode.toDataURL(secret.otpauth_url, function (err, data_url) {
                //         // res.send(data_url);
                //         let img = `<img src='${data_url}' >`
                //         res.send(img);
                //     });
                // } else {
                //     res.status(500).send(err);
            })
        })
    } else {
        res.status(500).send('error: no user');
    }
});

router.post(api, auth.required, (req, res) => {
    let get = req.body;
    console.log(typeof (req.body.credentials.googleAuthenticationCode) + "<<<<<<<<<<<<<<<<")
    console.log(req.payload)
    User.findById(req.payload.id, (err, result) => {
        if (result.validPassword(req.body.credentials.password)) {
            let match = speakeasy.totp.verify({
                secret: result.tfa.secret.base32,
                encoding: 'base32',
                token: req.body.credentials.googleAuthenticationCode
            });
            if (match) {
                User.findByIdAndUpdate(req.payload.id, { tfa: { effective: true, secret: result.tfa.secret } }, (err, result) => {
                    res.status(200).json(0);
                })
            } else {
                res.status(200).json(1);
            }
        } else {
            res.status(200).json(2)
        }
    })
})
router.patch(api, auth.required, (req, res) => {
    let get = req.body;
    console.log(typeof (req.body.credentials.googleAuthenticationCode) + "<<<<<<<<<<<<<<<<")
    console.log(req.payload)
    User.findById(req.payload.id, (err, result) => {
        if (result.validPassword(req.body.credentials.password)) {
            let match = speakeasy.totp.verify({
                secret: result.tfa.secret.base32,
                encoding: 'base32',
                token: req.body.credentials.googleAuthenticationCode
            });
            if (match) {
                User.findByIdAndUpdate(req.payload.id, { tfa: { effective: false, secret: {} } }, (err, result) => {
                    res.status(200).json(0);
                })
            } else {
                res.status(200).json(1);
            }
        } else {
            res.status(200).json(2)
        }
    })
})
module.exports = router;