var router = require('express').Router();
var speakeasy = require("speakeasy");
var mongoose = require('mongoose');
// var QRCode = require('qrcode');
var User = mongoose.model('User');
var auth = require('../auth');

const api = '/'

router.get(api, auth.required, (req, res) => {
    User.findById(req.payload.id, (err, result) => {
        if (!result) {
            res.status(500).json({ error: `username is invalid` });
        } else {
            if (result.tfa.effective) {
                res.status(500).json({ error: `this user'2fa was effective` });
            } else {
                let secret = speakeasy.generateSecret({ otpauth_url: false });
                User.findByIdAndUpdate(req.payload.id, {
                    tfa: { effective: false, secret: secret }
                }, (err, result) => {
                    if (!err) {
                        res.status(201).json(secret.base32);
                        //res.send(secret.base32);
                        //     QRCode.toDataURL(secret.otpauth_url, function (err, data_url) {
                        //         // res.send(data_url);
                        //         let img = `<img src='${data_url}' >`
                        //         res.send(img);
                        //     });
                    } else {
                        res.status(500).json(err);
                    }
                })
            }
        }
    })
});

router.post(api, auth.required, (req, res) => {
    let get = req.body;
    User.findById(req.payload.id, (err, result) => {
        if (result.validPassword(get.password)) {
            let match = speakeasy.totp.verify({
                secret: result.tfa.secret.base32,
                encoding: 'base32',
                token: get.token
            });
            if (match) {
                User.findByIdAndUpdate(req.payload.id, { tfa: { effective: true, secret: result.tfa.secret } }, (err, result) => {
                    res.status(200).json(true);
                })
            } else {
                res.status(500).json(false);
            }
        } else {
            res.status(500).json({ error: 'password is invalid' })
        }
    })
})
module.exports = router;