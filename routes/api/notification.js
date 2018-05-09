var router = require('express').Router();
var mongoose = require('mongoose');
var Notification = mongoose.model('notification');
var auth = require('../auth');

router.get('/', auth.optional, (req, res) => {
  //console.log(req.payload);
  let username = req.query.username;
  Notification.find({ username: `${username}` }, (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).json(result);
  });
});

router.delete('/', auth.required, (req, res) => {
  let deleteId = req.query._id;
  Notification.findByIdAndRemove({ _id: deleteId }, (err, result) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(result);
  });
});

module.exports = router;
