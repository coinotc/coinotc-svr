var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');

const walletApiKey = process.env.COINOTC_WALLET_API_KEY;
const ApiUrl = process.env.COINOTC_WALLET_API_URL;
const globalWalletPassword = process.env.COINOTC_GLOBAL_WALLET_PASSWORD;
const origin = process.env.COINOTC_WALLET_ORIGIN;

router.get('/wallet-info', auth.required, function(req, res, next){
    User.findById(req.payload.id)
    .then(function (user) {
        if (!user) {
            return res.sendStatus(401);
        }
        console.log('get-wallet info ...');
        currentUserEmail = result.email;
        var options = {
            url: `${ApiUrl}wallets/${currentUserEmail}`,
            headers : {
            'Authorization': `Bearer ${walletApiKey}`,
            'Origin': origin
            }
        };

        request.get(options)
        .on('response', function(response) {
            console.log(response.statusCode) // 200
            console.log(response.headers['content-type']);
            //console.log(response);
            return res.status(201).json(response);
        }).on('error', function(err) {
            console.log(err);
            res.status(500).send(err);
        })
    })
    .catch(next);
    
    
});

router.post('/withdrawal', auth.required, function(req, res, next){
    console.log('withdrawal ...');
});

router.get('/balance', auth.required, function(req, res, next){
    console.log('balance ...');
});

router.get('/locked-balance', auth.required, function(req, res, next){
    console.log('locked balance ...');
});

router.post('/createOrder', auth.required, function(req, res, next){
    console.log('Create an Order');
});


router.post('/releaseOrder', auth.required, function(req, res, next){
    console.log('Release Order');
});

module.exports = router;