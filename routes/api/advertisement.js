var router = require('express').Router();
var mongoose = require('mongoose');

var advertisement = mongoose.model('advertisement');
const advertisementapi = '/';

router.post(advertisementapi, (req, res) => {
    let get = req.body;
    let send = new advertisement();
    send.visible = get.visible
    send.owner = get.owner
    send.ownerid = mongoose.Types.ObjectId()
    send.crypto = get.crypto
    send.country = get.country
    send.fiat = get.fiat
    send.price = get.price
    send.min_price = get.min_price
    send.max_price = get.max_price
    send.fiat = get.fiat
    send.payment = get.payment
    send.limit = get.limit
    send.message = get.message
    send.type = get.type
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
router.get(advertisementapi, (req, res) => {
    let crypto = req.query.crypto;
    let type = req.query.type;
    let country = req.query.country;
    if (type == 0) {
        advertisement.find({ crypto: `${crypto}`, type: `${type}`, country: `${country}` }, null, { sort: { price: -1 } }, (err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).json(result);
        });
    } else {
        advertisement.find({ crypto: `${crypto}`, type: `${type}`, country: `${country}` }, null, { sort: { price: 1 } }, (err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).json(result);
        });
    }

})
router.get(advertisementapi + "myadvertisement/", (req, res) => {
    let owner = req.query.owner;
    let visible = req.query.visible;
    advertisement.find({ owner: `${owner}`, visible: `${visible}` }, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).json(result);
    });
})


module.exports = router;