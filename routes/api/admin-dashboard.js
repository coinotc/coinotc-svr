var router = require('express').Router();
var mongoose = require('mongoose');
var moment = require('moment');

var adbuy = mongoose.model('adbuy');
var adsell = mongoose.model('adsell');
var Order = mongoose.model('orderInformation');
var User = mongoose.model('User');

const orderapi = '/order';

router.get(`${orderapi}/sevenday`, (req, res) => {
  let array = [];
  let times = 0;
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
      (err, result) => {
        array[i] = result;
        times++;
        if (err) {
          console.log(err);
          res.status(500).send('error');
        }
        if (times == 7) {
          res.status(200).json(array);
        }
      }
    );
  }
});

router.get(`${orderapi}/sevendayCryptoTrades`, (req, res) => {
  let array = [];
  let finished = req.query.finished;
  let crypto = req.query.crypto;
  let times = 0;
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
      (err, result) => {
        console.log(result);
        for (let j = 0; j < result.length; j++) {
          sum = sum + result[j].quantity;
        }
        array[i] = sum;
        times++;
        console.log(array);
        if (err) {
          console.log(err);
          res.status(500).send('error');
        }
        if (times == 7) {
          console.log(array);
          res.status(200).json(array);
        }
      }
    );
  }
});
router.get(`${orderapi}/sevendayReg`, (req, res) => {
  let array = [];
  let times = 0;
  for (let i = 0; i < 7; i++) {
    // let aday = new Date((d => new Date(d.setDate(d.getDate() - i)).setHours(0, 0, 0, 0))(new Date())).toISOString(),
    //     beforeaday = new Date((d => new Date(d.setDate(d.getDate() - (i + 1))).setHours(0, 0, 0, 0))(new Date())).toISOString();
    User.count(
      {
        createdAt: {
          $gte: moment()
            .subtract(i + 1, 'days')
            .toDate(),
          $lt: moment()
            .subtract(i, 'days')
            .toDate()
        }
      },
      (err, result) => {
        array[i] = result;
        times++;
        if (err) {
          console.log(err);
          res.status(500).send('error');
        }
        if (times == 7) {
          res.status(200).json(array);
          console.log(array);
        }
      }
    );
  }
});
module.exports = router;
