var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');
var request = require('request')
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
        currentUserEmail = user.email;
        var options = {
            url: `${ApiUrl}wallets/${currentUserEmail}`,
            headers : {
            'Authorization': `Bearer ${walletApiKey}`,
            'Origin': origin
            }
        };

        request.get(options, function(error, response, body){
            if(error) res.status(500).send(error);
            console.log(body);
            let data = JSON.parse(body);
            console.log(data)
            var returnResult = {
                id: data._id,
                ETH: {
                    address: data.eth.address
                
                },
                ADA: {
                    address:data.cardano.accountInfo.caAddresses[0].cadId
                 
                },
                XRP: {
                    address:data.ripple.account.address
              
                },
                XLM: {
                    address: data.stellar.public_address
           
                },
                XMR: {
                    address: data.monero.accInfo[1].result.address
          
                }
                
            }
            console.log(returnResult)
            return res.status(201).json(returnResult);

        })
    })
    .catch(next);
});

router.post('/withdrawal', auth.required, function(req, res, next){
    console.log('withdrawal ...');
});

router.get('/balance', auth.required, function(req, res, next){
    console.log('balance ...');
    let _id = req.query.id;
    let _cryptoType = req.query.cryptoType;
    
    User.findById(req.payload.id)
    .then(function (user) {
        if (!user) {
            return res.sendStatus(401);
        }
        console.log('get-wallet info ...');
        currentUserEmail = user.email;
        var options = {
            url: `${ApiUrl}wallets/balance/${_id}/${_cryptoType}`,
            headers : {
            'Authorization': `Bearer ${walletApiKey}`,
            'Origin': origin
            }
        };

        request.get(options, function(error, response, body){
            if(error) res.status(500).send(error);
            console.log(body);
            let data = JSON.parse(body);
            console.log(data)
            var returnResult = {
                id: data._id,
                ETH: {
                    address: data.address,
                    balance: data.amount
                },
                ADA: {
                    address:data.cardano.accountInfo.caAddresses[0].cadId,
                    balance: data.amount
                },
                XRP: {
                    address:data.account.address,
                    balance: data.amount
                },
                XLM: {
                    address: data.stellar.public_address,
                    balance: data.balance
                },
                XMR: {
                    address: data.accInfo[1].result.address,
                    balance: data.balance
                }
                
            }
            console.log(returnResult)
            return res.status(201).json(returnResult);

        })
    })
    .catch(next);
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