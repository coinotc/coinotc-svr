var router = require('express').Router();
var mongoose = require('mongoose');

var adbuy = mongoose.model('adbuy');
var adsell = mongoose.model('adsell');

const adbuyapi = '/buy';
const adsellapi = '/sell';

    // adbuy
    router.get(adbuyapi,(req,res)=>{
        let crypto = req.query.crypto;
        adbuy.find({crypto:`${crypto}` },(err,result)=>{
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).json(result);
        });
    })
    router.post(adbuyapi,(req,res)=>{
        let get = req.body;
        let send = new adbuy();
        send.visible = get.visible
        send.owner = get.owner
        send.ownerid = mongoose.Types.ObjectId()
        send.crypto = get.crypto
        send.country = get.country
        send.fiat = get.fiat
        send.price = get.price
        send.max_price = get.max_price
        send.fiat = get.fiat
        send.payment = get.payment
        send.limit = get.limit
        send.massage = get.massage
        let error = send.validateSync();
        if (!error) {
            send.save(function (err, result) {
                res.status(201).json(result);
            });
        } else {
            console.log(error);
            res.status(500).send(error);
        }
    })


    // adsell
    router.get(adsellapi,(req,res)=>{
        let crypto = req.query.crypto;
        adsell.find({crypto:`${crypto}` },(err,result)=>{
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).json(result);
        });
    })
    router.post(adsellapi,(req,res)=>{
        let get = req.body;
        let send = new adsell();
        send.visible = get.visible
        send.owner = get.owner
        send.ownerid = mongoose.Types.ObjectId()
        send.crypto = get.crypto
        send.country = get.country
        send.fiat = get.fiat
        send.price = get.price
        send.max_price = get.max_price
        send.fiat = get.fiat
        send.payment = get.payment
        send.limit = get.limit
        send.massage = get.massage
        let error = send.validateSync();
        if (!error) {
            send.save(function (err, result) {
                res.status(201).json(result);
            });
        } else {
            console.log(error);
            res.status(500).send(error);
        }
    })

    module.exports = router;