var router = require('express').Router();
var mongoose = require('mongoose');
var rp = require('request-promise');

var advertisement = mongoose.model('advertisement');
const advertisementapi = '/';
var auth = require('../auth');

router.get(`${advertisementapi}getprice`, auth.required, (req, res) => {
    let type = req.query.type, fiat = req.query.fiat;
    rp({ uri: `https://api.coinmarketcap.com/v1/ticker/${type}/?convert=${fiat}`, json: true }).then((result) => {
        res.status(201).json(result);
    }).catch((err) => {
        res.status(500).send(`err: ${err}`);
    })
})


router.post(advertisementapi, auth.required, (req, res) => {
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
    send.deleteStatus = false;
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
router.get(advertisementapi, auth.required, (req, res) => {
    let crypto = req.query.crypto;
    let type = req.query.type;
    let country = req.query.country;
    let fiat = req.query.fiat;
    advertisement.find({ crypto: crypto, type: type, country: country, fiat: fiat, visible: true }, null, { sort: { price: -1 } }, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).json(result);
    });
})

router.get(advertisementapi, auth.required, (req, res) => {
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
router.get(advertisementapi + "myadvertisement/", auth.required, (req, res) => {
    let owner = req.query.owner;
    let visible = req.query.visible;
    advertisement.find({ owner: `${owner}`, visible: `${visible}`, deleteStatus: false }, (err, result) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
        res.status(200).json(result);
    });
});
router.get(advertisementapi + "editAdvertisement/", auth.required, (req, res) => {
    let id = req.query.id;
    advertisement.find({ _id: `${id}` }, (err, result) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
        res.status(200).json(result);
      }
    );
  });

router.get(advertisementapi, auth.required, (req, res) => {
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
router.get(advertisementapi + 'myadvertisement/',auth.required, (req, res) => {
  let owner = req.query.owner;
  let visible = req.query.visible;
  advertisement.find(
    { owner: `${owner}`, visible: `${visible}`, deleteStatus: false },
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).json(result);
    }
  );
});
router.get(advertisementapi + 'editAdvertisement/', auth.required, (req, res) => {
  let id = req.query.id;
  advertisement.find({ _id: `${id}` }, (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).json(result);
  });
});
router.patch(advertisementapi, (req, res) => {
  let id = req.query._id;
  let visible = req.body.visible;
  advertisement.findOneAndUpdate(
    { _id: id },
    { visible: !visible },
    (err, result) => {
      if (err) res.status(500).json(err);
      res.status(201).json(result);
    }
  );
});
router.patch(advertisementapi + 'deleteStatuts/', auth.required,(req,res)=>{
    let id = req.body._id;
    console.log(id)
    advertisement.findOneAndUpdate(
    { _id: id },
    { deleteStatus: true },
    (err, result) => {
      if (err) res.status(500).json(err);
      res.status(201).json(result);
    }
  );
});
router.put(advertisementapi + 'editAdvertisement/', auth.required, (req, res) => {
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
    newAdvertisementInfo.deleteStatus = Info.deleteStatus;
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
