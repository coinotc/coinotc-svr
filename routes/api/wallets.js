var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var Wallet = mongoose.model('Wallet');
var auth = require('../auth');

router.post('/generate', auth.required, function(req, res, next){
    console.log('generate all wallets');
    User.findById(req.payload.id).then(function(user){
        if(!user){ return res.sendStatus(401); };
        let currentUserEmail = null;
        if(typeof user.email !== 'undefined'){
            currentUserEmail = user.email;
        }
        
        let wallets = [
            {},
            {},
            {},
            {},
            {}
        ];

        Wallet.bulkInsert(wallets, function(err, results) {
            if (err) {
              console.log(err);
            } 

        });

    }).catch(next);
});

router.post('/send', auth.required, function(req, res, next){
    console.log('transaction crypto ...');
});

router.get('/create', auth.required, function(req, res, next){
    console.log('create a new wallet');
});


module.exports = router;