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

router.post('/', (req, res) => {
  let alert = req.body;
  let newAlert = new Alert();
  newAlert.username = alert.username;
  newAlert.price = alert.price;
  newAlert.crypto = alert.crypto;
  newAlert.fiat = alert.fiat;
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

//router.delete('/', (req, res) => {});

module.exports = router;
