var router = require('express').Router();
var mongoose = require('mongoose');
var moment = require('moment');

var adbuy = mongoose.model('adbuy');
var adsell = mongoose.model('adsell');
var Order = mongoose.model('orderInformation');

const orderapi = '/order';

router.get(`${orderapi}/sevenday`, (req, res) => {
  let array = [];
  for (let i = 0; i < 7; i++) {
    // let aday = new Date((d => new Date(d.setDate(d.getDate() - i)).setHours(0, 0, 0, 0))(new Date())).toISOString(),
    //     beforeaday = new Date((d => new Date(d.setDate(d.getDate() - (i + 1))).setHours(0, 0, 0, 0))(new Date())).toISOString();
    Order.count(
      {
        date: {
          $gte: moment()
            .subtract(i + 1, 'days')
            .toDate(),
          $lt: moment()
            .subtract(i, 'days')
            .toDate()
        }
      },
      (err, result, time = i) => {
        array.unshift(result);
        if (err) {
          console.log(err);
          res.status(500).send('error');
        }
        if (time === 6) {
          res.status(200).json(array);
        }
      }
    );
  }
});

router.get(`${orderapi}/sevendayCrypto`, (req, res) => {
  let array = [];
  let finished = req.query.finished;
  let crypto = req.query.crypto;
  for (let i = 0; i < 7; i++) {
    let sum = 0;
    console.log(req.query);
    Order.find(
      {
        date: {
          $gte: moment()
            .subtract(i + 1, 'days')
            .toDate(),
          $lt: moment()
            .subtract(i, 'days')
            .toDate()
        },
        crypto: `${crypto}`,
        finished: `${finished}`
      },
      'quantity -_id',
      (err, result, time = i) => {
        for (let j = 0; j < result.length; j++) {
          sum = sum + result[j].quantity;
        }
        array.unshift(sum);
        console.log(array);
        if (err) {
          console.log(err);
          res.status(500).send('error');
        }
        if (time === 6) {
          res.status(200).json(array);
        }
      }
    );
  }
});

module.exports = router;
