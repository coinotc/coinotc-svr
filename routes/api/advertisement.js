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
    send.deleteStatuts = false;
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
    let fiat = req.query.fiat
    if (type == 0) {
        advertisement.find({ crypto: crypto, type: type, country: country, fiat: fiat }, null, { sort: { price: -1 } }, (err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).json(result);
        });
    } else {
        advertisement.find({ crypto: crypto, type: type, country: country, fiat: fiat }, null, { sort: { price: 1 } }, (err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).json(result);
        });
    }
})

router.get(advertisementapi, (req, res) => {
    let crypto = req.query.crypto;
    let type = req.query.type;
    advertisement.find(
        { crypto: `${crypto}`, type: `${type}` },
        (err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).json(result);
        }
    );
});
router.get(advertisementapi + "myadvertisement/", (req, res) => {
    let owner = req.query.owner;
    let visible = req.query.visible;
    advertisement.find({ owner: `${owner}`, visible: `${visible}`,deleteStatuts:false }, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).json(result);
    });
});
router.get(advertisementapi + "editAdvertisement/", (req, res) => {
    let id = req.query.id;
    advertisement.find({ _id: `${id}` }, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).json(result);
    });
});
router.patch(advertisementapi,(req,res)=>{
    let id = req.query._id;
    let visible = req.body.visible;
    advertisement.findOneAndUpdate(
    { _id: id },
    { visible: !visible },
    (err, result) => {
      if (err) res.status(500).json(err);
      res.status(201).json(result);
    });
});

router.patch(advertisementapi + 'deleteStatuts/',(req,res)=>{
    let id = req.body._id;
    console.log(id)
    advertisement.findOneAndUpdate(
    { _id: id },
    { deleteStatuts: true },
    (err, result) => {
      if (err) res.status(500).json(err);
      res.status(201).json(result);
    });
});
router.put(advertisementapi + 'editAdvertisement/', (req, res) => {
    let Info = req.body;
    console.log(req.body);
    let newAdvertisementInfo = new advertisement();
    newAdvertisementInfo._id = Info._id;
    newAdvertisementInfo.type = Info.type;
    newAdvertisementInfo.message = Info.message;
    newAdvertisementInfo.limit = Info.limit;
    newAdvertisementInfo.payment = Info.payment;
    newAdvertisementInfo.max_price = Info.max_price;
    newAdvertisementInfo.min_price = Info.min_price;
    newAdvertisementInfo.price = Info.price;
    newAdvertisementInfo.fiat = Info.fiat;
    newAdvertisementInfo.country = Info.country;
    newAdvertisementInfo.crypto = Info.crypto;
    newAdvertisementInfo.owner = Info.owner;
    newAdvertisementInfo.visible = Info.visible;
    newAdvertisementInfo.deleteStatuts = Info.deleteStatuts;
    console.log("<<<<" + newAdvertisementInfo)
    // newOrderInformation._id = orderInformation._id;
    // newOrderInformation.informed = orderInformation.informed;
    // newOrderInformation.finished = orderInformation.finished;
    var error = newAdvertisementInfo.validateSync();
    if (!error) {
      //console.log(user._id);
      advertisement.findByIdAndUpdate(
        { _id: Info._id },
        { $set: newAdvertisementInfo },
        { new: true },
        (err, result) => {
          if (err) res.status(500).json(err);
          res.status(201).json(result);
        }
      );
    }
  });
module.exports = router;
