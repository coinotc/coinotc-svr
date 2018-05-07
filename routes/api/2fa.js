var router = require('express').Router();
var speakeasy = require("speakeasy");
var mongoose = require('mongoose');
var QRCode = require('qrcode');
var User = mongoose.model('User');
var auth = require('../auth');

const api = '/'

router.get(api, auth.optional,(req, res) => {
    let user = req.query;
    if (user) {
        User.findOne({ username: user.username }, (err, result) => {
            if (!result) {
                res.status(500).send('error:username is invalid');
            } else {
                if (result.tfa.effective) {
                    res.status(500).send(`error:this user'2fa was effective`);
                } else {
                    let secret = speakeasy.generateSecret({ name: `Coinotc (${result.email})` });
                    User.findOneAndUpdate({ username: user.username }, {
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
                            // } else {
                            //     res.status(500).send(err);
                        }
                    })
                }
            }
        })
    } else {
        res.status(500).send('error: no user');
    }
});

router.post(api, auth.optional,(req, res) => {
    let get = req.body;
    User.findOne({ username: get.username }, (err, result) => {
        if (!result.tfa.effective) {
            let match = speakeasy.totp.verify({
                secret: result.tfa.secret.base32,
                encoding: 'base32',
                token: get.token
            });
            if (match) {
                res.send('yes');
            } else {
                res.send('no');
            }
        } else {
            res.status(500).send(`error:this user'2fa is effective`)
        }
    })
})
module.exports = router;