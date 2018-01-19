var router = require('express').Router();
var mongoose = require('mongoose');

var Order = mongoose.model('orderInformation');

const apiurl = '/';

router.get(apiurl, (req, res) => {
    // let orderID = req.query._id;
    console.log(req.query)
    Order.find((err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).json(result);
    });
});

router.get(apiurl + 'buyer', (req, res) => {
    let finished = req.query.finished;
    let username = req.query.username;
    console.log(req.query)
    Order.find({ buyer: `${username}`, finished: `${finished}` }, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return; 
        }
        res.status(200).json(result);
    });
});

router.get(apiurl + 'seller', (req, res) => {
    let finished = req.query.finished;
    let username = req.query.username;
    console.log(req.query)
    Order.find({ seller: `${username}`, finished: `${finished}` }, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).json(result);
    });
});

router.post(apiurl, (req, res) => {
    let get = req.body;
    let send = new Order();
    send.buyer = get.buyer;
    send.seller = get.seller;
    send.crypto = get.crypto;
    send.country = get.country;
    send.quantity = get.quantity;
    send.price = get.price;
    send.amount = get.amount;
    send.fiat = get.fiat;
    send.payment = get.payment;
    send.limit = get.limit;
    send.finished = get.finished;
    send.date = new Date();
    console.log(send);
    let error = send.validateSync();
    if (!error) {
        send.save(function (err, result) {
            res.status(201).json(result);
        });
    } else {
        console.log(error);
        res.status(500).send(error);
    }
});

router.put(apiurl, (req, res) => {
    let orderInformation = req.body;
    console.log(req.body)
    let newOrderInformation = new Order();
    newOrderInformation._id = orderInformation._id;
    newOrderInformation.finished = orderInformation.finished;
    var error = newOrderInformation.validateSync();
    if (!error) {
        //console.log(user._id);
        Order.findByIdAndUpdate({ _id: orderInformation._id }, { $set: newOrderInformation }, { new: true }, (err, result) => {
            if (err) res.status(500).json(err);
            res.status(201).json(result);
        })
    }
});

module.exports = router;
