var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');

const walletApiKey = process.env.COINOTC_WALLET_API_KEY;
const ApiUrl = process.env.COINOTC_WALLET_API_URL;
const globalWalletPassword = process.env.COINOTC_GLOBAL_WALLET_PASSWORD;

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