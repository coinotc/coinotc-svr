var router = require('express').Router();
var mongoose = require('mongoose');
var Alert = mongoose.model('alert');

router.get('/', (req, res) => {
  let username = req.query.username;
  let crypto = req.query.crypto;
  Alert.find(
    { username: `${username}`, crypto: `${crypto}` },
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).json(result);
    }
  );
});

router.get('/getAbove', (req, res) => {
  let above = req.query.above;
  let status = req.query.status;
  let fiat = req.query.fiat;
  let crypto = req.query.crypto;
  let price = req.query.price;
  let array = [];
  let times = 0;
  Alert.find(
    {
      above: `${above}`,
      status: `${status}`,
      fiat: `${fiat}`,
      crypto: `${crypto}`,
      price: { $gt: `${price}` }
    },
    //'username -_id',
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).json(result);
    }
  );
});

router.get('/getBelow', (req, res) => {
  let above = req.query.above;
  let status = req.query.status;
  let fiat = req.query.fiat;
  let crypto = req.query.crypto;
  let price = req.query.price;
  let array = [];
  let times = 0;
  Alert.find(
    {
      above: `${above}`,
      status: `${status}`,
      fiat: `${fiat}`,
      crypto: `${crypto}`,
      price: { $lt: `${price}` }
    },
    //'username -_id',
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).json(result);
    }
  );
});

router.post('/', (req, res) => {
  let alert = req.body;
  let newAlert = new Alert();
  newAlert.username = alert.username;
  newAlert.price = alert.price;
  newAlert.crypto = alert.crypto;
  newAlert.fiat = alert.fiat;
  newAlert.status = alert.status;
  newAlert.date = new Date();
  console.log(newAlert);
  let error = newAlert.validateSync();
  if (!error) {
    newAlert.save(function(err, result) {
      res.status(201).json(result);
    });
  } else {
    console.log(error);
    res.status(500).send(error);
  }
});

router.put('/', (req, res) => {
  let alert = req.body;
  console.log(req.body);
  let newAlert = new Alert();
  newAlert._id = alert._id;
  newAlert.status = alert.status;
  var error = newAlert.validateSync();
  if (!error) {
    //console.log(user._id);
    Alert.findByIdAndUpdate(
      { _id: alert._id },
      { $set: newAlert },
      { new: true },
      (err, result) => {
        if (err) res.status(500).json(err);
        res.status(201).json(result);
      }
    );
  }
});

//router.delete('/', (req, res) => {});

module.exports = router;
