var router = require('express').Router();
var mongoose = require('mongoose');

var Order = mongoose.model('orderInformation');

const apiurl = '/';

//GET ALERT INFORMATION
router.get(apiurl + 'alert', (req, res) => {
  let fiat = req.query.fiat;
  let crypto = req.query.crypto;
  let sum = 0;
  Order.find({ fiat: `${fiat}`, crypto: `${crypto}` }, (err, result) => {
    //console.log(result);
    for (let i = 0; i < result.length; i++) {
      sum = sum + result[i].price / result.length;
    }
    //console.log(typeof sum);
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).json(sum);
  })
    .sort({ date: -1 })
    .limit(5);
});

//SEARCH & GET PROJECTS
router.get(apiurl, (req, res) => {
  var query = {};
  var keyword = req.query.keyword;
  if (typeof keyword == 'undefined') {
    keyword = '';
  }
  if (keyword !== '') {
    query = { _id: `${keyword}` };
  }
  Order.find(query, (err, result) => {
    if (err) {
      // console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(result);
  });
});

//GET A SPECIFIC ORDER
router.get(apiurl + 'getone', (req, res) => {
  var id = req.query._id;
  Order.findById({ _id: `${id}` }, (err, result) => {
    if (err) {
      // console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(result);
  });
});

//FILTER ORDERS
router.get(apiurl + 'filter', (req, res) => {
  let finished = req.query.finished;
  let username = req.query.username;
  Order.find(
    {
      finished: `${finished}`,
      $or: [{ buyer: `${username}` }, { seller: `${username}` }]
    },
    (err, result) => {
      if (err) {
        // console.log(err);
        res.status(500).send(err);
        return;
      }
      res.status(200).json(result);
    }
  );
});

// router.get(apiurl + 'buyer', (req, res) => {
//   let finished = req.query.finished;
//   let username = req.query.username;
//   console.log(req.query);
//   Order.find(
//     { buyer: `${username}`, finished: `${finished}` },
//     (err, result) => {
//       if (err) {
//         res.status(500).send(err);
//         return;
//       }
//       res.status(200).json(result);
//     }
//   );
// });

// router.get(apiurl + 'seller', (req, res) => {
//   let finished = req.query.finished;
//   let username = req.query.username;
//   console.log(req.query);
//   Order.find(
//     { seller: `${username}`, finished: `${finished}` },
//     (err, result) => {
//       if (err) {
//         res.status(500).send(err);
//         return;
//       }
//       res.status(200).json(result);
//     }
//   );
// });

router.post(apiurl, (req, res) => {
  let order = req.body;
  let newOrder = new Order();
  newOrder.buyer = order.buyer;
  newOrder.seller = order.seller;
  newOrder.owner = order.owner;
  newOrder.crypto = order.crypto;
  newOrder.country = order.country;
  newOrder.quantity = order.quantity;
  newOrder.price = order.price;
  newOrder.amount = order.amount;
  newOrder.fiat = order.fiat;
  newOrder.payment = order.payment;
  newOrder.limit = order.limit;
  newOrder.message = order.message;
  newOrder.informed = order.informed;
  newOrder.finished = order.finished;
  newOrder.roomkey = order.roomkey;
  newOrder.date = new Date();
  console.log(newOrder);
  let error = newOrder.validateSync();
  if (!error) {
    newOrder.save(function (err, result) {
      res.status(201).json(result);
    });
  } else {
    console.log(error);
    res.status(500).send(error);
  }
});

router.patch(apiurl + 'roomkey', (req, res) => {
  console.log('patch roomkey' + req.body);
  console.log('patch roomkey' + req.query);
  Order.findOneAndUpdate(
    { _id: req.query.orderId },
    { roomkey: req.body.roomkey },
    (err, result) => {
      if (err) res.status(500).json(err);
      res.status(201).json(result);
    }
  );
});
router.put(apiurl, (req, res) => {
  let orderInformation = req.body;
  console.log(req.body);
  let newOrderInformation = new Order();
  newOrderInformation._id = orderInformation._id;
  newOrderInformation.informed = orderInformation.informed;
  newOrderInformation.finished = orderInformation.finished;
  var error = newOrderInformation.validateSync();
  if (!error) {
    //console.log(user._id);
    Order.findByIdAndUpdate(
      { _id: orderInformation._id },
      { $set: newOrderInformation },
      { new: true },
      (err, result) => {
        if (err) res.status(500).json(err);
        res.status(201).json(result);
      }
    );
  }
});

module.exports = router;
