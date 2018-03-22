var router = require('express').Router();
var speakeasy = require("speakeasy");
var mongoose = require('mongoose');
var QRCode = require('qrcode');
var User = mongoose.model('User');

const api = '/'

router.get(api, (req, res) => {
    let user = req.query;
    if (user) {
        User.findOne({ username: user.username }, (err, result) => {
            if (result.tfa.effective) {
                res.status(500).send(`error:this user'2fa is effective`);
            } else {
                let secret = speakeasy.generateSecret();
                User.findOneAndUpdate({ username: user.username }, {
                    tfa: { effective: false, secret: secret }
                }, (err, result) => {
                    if (!err) {
                        let url = speakeasy.otpauthURL({ secret: secret.ascii, label: `Coinotc (${user.username})`, algorithm: 'sha512' });
                        console.log(url);
                        QRCode.toDataURL(url, function (err, data_url) {
                            // res.send(data_url);
                            let img = `<img src='${data_url}' >`
                            res.send(img);
                        });
                    } else {
                        res.status(500).send(err);
                    }
                })
            }
        })
    } else {
        res.status(500).send('error: no user');
    }
});

router.post(api, (req, res) => {
    let get = req.body;
    User.find({ username: get.username }, (err, result) => {
        if (!result[0].tfa.effective) {
            let match = speakeasy.totp.verify({
                secret: result[0].tfa.secret.base32,
                encoding: 'base32',
                token: get.token
              });
              if (match){
                  res.send('yes');
              }else{
                  res.send('no');
              }
        } else {
            res.status(500).send(`error:this user'2fa is effective`)
        }
    })
})
module.exports = router;