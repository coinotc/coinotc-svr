var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');
var request = require('request');
var rp = require('request-promise');

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
                    address: data.monero.accInfo[2].result.address
          
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
    console.log(">>> transfer crypto >>> " + req.body);
    console.log(">>> treq.payload.id >>> " + req.payload.id);
    User.findById(req.payload.id)
    .then(function (user) {
        console.log(">>> user>>> " + user);
        if (!user) {
            return res.sendStatus(401);
        }
        console.log(">>> {req.body.type>>> " + req.body.type);
        console.log(">>> {req.body.type>>> " + user.baseCurrency);
        let userCurrency = user.baseCurrency;
        if(typeof(user.baseCurrency) === 'undefined' ){
            userCurrency = "USD";
        }
        console.log(">>> {req.body.type>>> " +userCurrency);
        let idType = 0;
        if(req.body.type.toUpperCase() === 'ETH'){
            idType = 'ethereum';
        }else if (req.body.type.toUpperCase() === 'XRP'){
            idType = 'ripple';
        }else if (req.body.type.toUpperCase() === 'ADA'){
            idType = 'cardano';
        }else if (req.body.type.toUpperCase() === 'XLM'){
            idType = 'stellar';
        }else if (req.body.type.toUpperCase() === 'XMR'){
            idType = 'monero';
        }

        rp({ uri: `https://api.coinmarketcap.com/v1/ticker/${idType}/?convert=${userCurrency}`, json: true }).then((result) => {
            console.log("result > " + result)
            let equivAmount = parseInt(result) * parseInt(req.body.amount);
            console.log(equivAmount);
            var withdrawalPostBody = {
                "cryptoCurrency": req.body.type.toUpperCase(),
                "email": user.email,
                "unit": req.body.amount,
                "transactCurrency": user.baseCurrency,
                "pin": user.tradePasswordHash,
                "equivalentAmount": equivAmount,
                "beneficiaryAddress": req.body.address,
                "memo": req.body.notes
            }
            console.log('TRANSFER > ...' + withdrawalPostBody);
            currentUserEmail = user.email;
            var options = {
                url: `${ApiUrl}transactions/withdrawal`,
                headers : {
                'Authorization': `Bearer ${walletApiKey}`,
                'Origin': origin
                },
                body: withdrawalPostBody,
                json:true
            };

            request.post(options, function(error, response, body){
                if(error) res.status(500).send(error);
                console.log(body);
                return res.status(201).json(body);
            })
        }).catch((err) => {
            console.log(err);
            res.status(500).send(`err: ${err}`);
        })

        
    })
    .catch((err) => {
        res.status(500).send(`err: ${err}`);
    })
});

router.get('/balance/:id/:cryptoType', auth.required, function(req, res, next){
    console.log('balance ...');
    let _id = req.params.id;
    let _cryptoType = req.params.cryptoType.toLowerCase();
    console.log("_id : " + _id);
    console.log("_cryptoType : " + _cryptoType);
    
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
                balance: ''
            }
            console.log(_cryptoType)
            if((_cryptoType === "eth") || (_cryptoType === "ada") || (_cryptoType === "xrp")){
                returnResult.balance = data.amount
            }else if((_cryptoType === "xlm") || (_cryptoType === "xmr")){
                returnResult.balance = data.balance
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