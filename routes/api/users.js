var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');
var crypto = require('crypto');
var randomstring = require('randomstring');

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

router.patch('/users/public/follow', auth.required, (req, res) => {
  //console.log(req.body);
  //console.log(req.query);
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
router.get('/users/verify' , (req, res) => {
  User.findOneAndUpdate(
    { secretToken: req.query.secretToken },
    { secretToken: '' , active : true},
    { new: true },
    (err, result) => {
      console.log(err)
      if (err) 
      res.status(500).json(err);
      res.status(201).json("success");
    }
  );
})
router.patch('/users/public/followers', auth.required, (req, res) => {
  //console.log(req.body);
  //console.log(req.query);
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
router.patch('/users/randomstring', auth.required, (req, res) => {
  //console.log(req.body);
  //console.log(req.query);
  User.findOneAndUpdate(
    { username: req.body.username },
    { secretToken: randomstring.generate() },
    { new: true },
    (err, result) => {
      if (err) res.status(500).json(err);
      res.status(201).json(result);
    }
  );
});
router.patch('/users/public/ratings', auth.required, (req, res) => {
  //console.log(req.body);
  //console.log(req.query);
  User.findOneAndUpdate(
    { username: req.query.username },
    { ratings: req.body },
    { new: true },
    (err, result) => {
      if (err) res.status(500).json(err);
      res.status(201).json(result);
    }
  );
});

router.patch('/users/public/tradepassword', auth.required, (req, res) => {
  //console.log(req.body);
  //console.log(req.query);
  var user = new User();
  user.setTradePassword(req.body.tradePrd);
  User.findOneAndUpdate(
    { username: req.query.username },
    {
      tradePasswordSalt: user.tradePasswordSalt,
      tradePasswordHash: user.tradePasswordHash
    },
    (err, result) => {
      if (err) res.status(500).json(err);
      res.status(201).json(result);
    }
  );
});

router.patch('/users/public/deviceToken', auth.required, (req, res) => {
  console.log(req.body);
  console.log(req.query);
  User.findOneAndUpdate(
    { username: req.query.username },
    { deviceToken: req.body.deviceToken },
    { new: true },
    (err, result) => {
      if (err) res.status(500).json(err);
      res.status(201).json(result);
    }
  );
});

router.put('/user', auth.required, auth.required, function(req, res, next) {
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
      // if (typeof req.body.user.goodCount !== 'undefined') {
      //   user.goodCount = req.body.user.goodCount;
      // }
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
  //console.log(req.payload);
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
      console.log(user)
      user.deviceToken = req.body.deviceToken;
      console.log(user);
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON(),active:user.active });
    } else {
      console.log(info);
      console.log('---' + err);
      res.status(500).json(info);
      return;
    }
  })(req, res, next);
});

router.post('/users', function(req, res, next) {
  console.log('--- Register ---- ');
  console.log(req);
  var user = new User();
  user.active = false;
  user.verify = '0';
  user.ratings = [];
  user.orderCount = '0';
  user.volume = '';
  user.verifyName = '';
  user.idCard = '';
  user.phone = '';
  user.tradePrd = '';
  user.following = [];
  user.followers = [];
  user.tfa = {
    effective: false,
    secret: {}
  };
  user.secretToken = randomstring.generate();
  user.deviceToken = req.body.deviceToken;
  user.username = req.body.user.username;
  user.email = req.body.user.email;
  console.log(req.body.user.password);
  user.setPassword(req.body.user.password);

  user
    .save()
    .then(function() {
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(error => {
      res.status(500).send(error);
      return;
    });
});

router.get('/users/public', auth.required, (req, res) => {
  let username = req.query.username;

  console.log(req.query);
  User.find(
    { username: `${username}` },
    'orderCount ratings volume deviceToken following followers',
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

/**
 * require auth ?
 */
router.get('/users/tradepassword', auth.required, (req, res) => {
  let username = req.query.username;
  let currentUser = req.user;
  console.log('>>> ' + currentUser.username);
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
