var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');

router.get('/user', auth.required, function(req, res, next) {
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});
router.patch('/users/public/follow', (req, res) => {
  console.log(req.body);
  console.log(req.query);
  User.findOneAndUpdate(
    { username: req.query.username },
    { following: req.body },
    { new: true },
    (err, result) => {
      if (err) res.status(500).json(err);
      res.status(201).json(result);
    }
  );
});
router.patch('/users/public/followers', (req, res) => {
  console.log(req.body);
  console.log(req.query);
  User.findOneAndUpdate(
    { username: req.query.username },
    { followers: req.body },
    { new: true },
    (err, result) => {
      if (err) res.status(500).json(err);
      res.status(201).json(result);
    }
  );
});

router.patch('/users/public/comment', (req, res) => {
  console.log(req.body);
  console.log(req.query);
  User.findOneAndUpdate(
    { username: req.query.username },
    { goodCount: req.body.good },
    { new: true },
    (err, result) => {
      if (err) res.status(500).json(err);
      res.status(201).json(result);
    }
  );
});

router.patch('/users/public/tradepassword', (req, res) => {
  console.log(req.body);
  console.log(req.query);
  User.findOneAndUpdate(
    { username: req.query.username },
    { tradePrd: req.body.tradePrd },
    (err, result) => {
      if (err) res.status(500).json(err);
      res.status(201).json(result);
    }
  );
});
router.put('/user', auth.required, function(req, res, next) {
  console.log(req.body.user);
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      // only update fields that were actually passed...
      if (typeof req.body.user.username !== 'undefined') {
        user.username = req.body.user.username;
      }
      if (typeof req.body.user.email !== 'undefined') {
        user.email = req.body.user.email;
      }
      if (typeof req.body.user.bio !== 'undefined') {
        user.bio = req.body.user.bio;
      }
      if (typeof req.body.user.image !== 'undefined') {
        user.image = req.body.user.image;
      }
      if (typeof req.body.user.password !== 'undefined') {
        user.setPassword(req.body.user.password);
      }
      if (typeof req.body.user.goodCount !== 'undefined') {
        user.goodCount = req.body.user.goodCount;
      }
      if (typeof req.body.user.orderCount !== 'undefined') {
        user.orderCount = req.body.user.orderCount;
      }
      if (typeof req.body.user.idCard !== 'undefined') {
        user.idCard = req.body.user.idCard;
      }
      if (typeof req.body.user.verifyName !== 'undefined') {
        user.verifyName = req.body.user.verifyName;
      }
      if (typeof req.body.user.phone !== 'undefined') {
        user.phone = req.body.user.phone;
      }
      if (typeof req.body.user.tradePrd !== 'undefined') {
        user.tradePrd = req.body.user.tradePrd;
      }
      console.log(user);
      return user.save().then(function() {
        return res.json({ user: user.toAuthJSON() });
      });
    })
    .catch(next);
});

router.put('/users/base-currency', auth.required, function(req, res, next) {
  console.log(req.payload);
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      // only update fields that were actually passed...
      if (typeof req.body.currency !== 'undefined') {
        user.baseCurrency = req.body.currency;
      }

      return user.save().then(function() {
        return res.json({ user: user.toAuthJSON() });
      });
    })
    .catch(next);
});

router.post('/users/login', function(req, res, next) {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate('local', { session: true }, function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      user.deviceToken = req.body.deviceToken;
      console.log(user);
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

router.post('/users', function(req, res, next) {
  console.log('here');
  var user = new User();
  user.verify = '0';
  user.goodCount = '0';
  user.orderCount = '0';
  user.volume = '';
  user.verifyName = '';
  user.idCard = '';
  user.phone = '';
  user.tradePrd = '';
  user.following = [];
  user.followers = [];
  user.tfa = {
    effective:false,
    secret:{}
  }

  user.deviceToken = req.body.deviceToken;
  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  user
    .save()
    .then(function() {
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

router.get('/users/public', (req, res) => {
  let username = req.query.username;
  
  console.log(req.query);
  User.find(
    { username: `${username}` },
    'orderCount goodCount volume deviceToken following followers',
    (err, result) => {
      console.log(result);
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).json(result);
    }
  );
});
router.get('/users/tradepassword', (req, res) => {
  let username = req.query.username;

  console.log(req.query);
  User.find({ username: `${username}` }, 'tradePrd', (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).json(result);
  });
});


router.get('/users/logout', auth.required, function(req, res, next) {
  console.log(req.payload.id);
  let currentUser = req.user;
  console.log(currentUser);

  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      return user.logout().then(function() {
        res.json({ logoutdatetime: new Date() });
      });
      req.logout(); // clears the passport session
      req.session.destroy(); // destroys all session related data
    })
    .catch(next);
});

module.exports = router;
