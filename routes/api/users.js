var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');
var crypto = require('crypto');
var randomstring = require('randomstring');
var mailgun = require('mailgun-js');
var sendEmail = require('../../config/sendEmail');
const Email = require('email-templates');
const email = new Email();

router.get('/user', auth.required, function (req, res, next) {
  User.findById(req.payload.id)
    .then(function (user) {
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
router.patch('/users/changeOnlineStatus', auth.required, (req, res) => {
  //console.log(req.body);
  //console.log(req.query);
  console.log(req.body.onlineStatus)
  User.findOneAndUpdate(
    { username: req.payload.username },
    { online: req.body.onlineStatus },
    { new: true },
    (err, result) => {
      if (err) res.status(500).json(err);
      res.status(201).json(result);
    }
  );
});



router.get('/users/verify', (req, res) => {
  console.log('verify email after registration');
  if (req.query.secretToken == null) {
    return res.status(500).json({ error: 'error verifying user.' });
  }
  User.findOneAndUpdate(
    { secretToken: req.query.secretToken },
    { secretToken: '', active: true },
    { new: true },
    (err, result) => {
      console.log(err);
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(201).json({ status: 'success' });
    }
  );
});
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

router.patch('/users/kyc', auth.required, (req, res) => {
  console.log(req.body)
  User.findOneAndUpdate(
    { username: req.payload.username },
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      country: req.body.country,
      passport: req.body.passport,
      kycImg: req.body.kycImg
    },
    { new: true },
    (err, result) => {
      if (err) res.status(500).json(err);
      res.status(201).json(result);
    }
  );
})

// router.post('/upload-firestore', googleMulter.array('passportCover','passportPage','photoAndID'), (req, res) => {
//   console.log('upload here ...');
//   console.log(req.file);
//   //console.log(req)  
//   uploadToFireBaseStorage(req.file).then((result => {
//     console.log("firebase stored -> " + result);
//     let bannerControl = new BannerControl();
//     bannerControl.imgURL = result;
//     let error = bannerControl.validateSync();
//     if (!error) {
//       bannerControl.save(function (err, result) {
//       })
//     } else {
//       res.status(500).send(error);
//     }
//   })).catch((error) => {
//     console.log(error);
//   })
//   res.status(200).json({});
// })


router.patch('/users/public/tradepassword', auth.required, (req, res) => {
  var user = new User();
  user.setTradePassword(req.body.tradePrd);
  User.findOneAndUpdate(
    { username: req.body.username },
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

router.patch('/users/setNewPassword', (req, res) => {
  var user = new User();
  console.log(req.body.user.password);
  console.log(req.body.email);
  user.setPassword(req.body.user.password);
  User.findOneAndUpdate(
    { email: req.body.email },
    {
      salt: user.salt,
      hash: user.hash
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

router.put('/user', auth.required, auth.required, function (req, res, next) {
  console.log(req.body.user);
  User.findById(req.payload.id)
    .then(function (user) {
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
      console.log(user);
      return user.save().then(function () {
        return res.json({ user: user.toAuthJSON() });
      });
    })
    .catch(next);
});


router.put('/users/base-currency', auth.required, function (req, res, next) {
  //console.log(req.payload);
  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }

      // only update fields that were actually passed...
      if (typeof req.body.currency !== 'undefined') {
        user.baseCurrency = req.body.currency;
      }

      return user.save().then(function () {
        return res.json({ user: user.toAuthJSON() });
      });
    })
    .catch(next);
});

router.put('/users/language', auth.required, function (req, res, next) {
  console.log('... update language ...');
  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }
      // only update fields that were actually passed...
      if (typeof req.body.language !== 'undefined') {
        user.preferLanguage = req.body.language;
      }

      return user.save().then(function () {
        return res.json({ user: user.toAuthJSON() });
      });
    })
    .catch(next);
});

router.put('/users/region', auth.required, function (req, res, next) {
  console.log('... update region ...');
  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }
      // only update fields that were actually passed...
      if (typeof req.body.region !== 'undefined') {
        user.nativeRegion = req.body.region;
      }

      return user.save().then(function () {
        return res.json({ user: user.toAuthJSON() });
      });
    })
    .catch(next);
});
router.post('/users/login', function (req, res, next) {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate('local', { session: true }, function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (user) {
      if (user.ip.length < 5) user.ip.unshift(req.body.ip);
      else {
        user.ip.pop();
        user.ip.unshift(req.body.ip);
      }
      User.findOneAndUpdate(
        { username: user.username },
        { ip: user.ip, online: true },
        { new: true },
        (err, result) => {
          if (err) res.status(500).json(err);
          //res.status(201).json(result);
        }
      );
      console.log(user.ip[0].query);
      console.log(user.ip[1].query);
      console.log(!(user.ip[0].query == user.ip[1].query));
      if (!(user.ip[0].query == user.ip[1].query)) {
        var mailgun = new Mailgun({
          apiKey: sendEmail.api_key,
          domain: sendEmail.domain
        });
        email
          .renderAll('ip-changed', {
            name: user.username,
            ip: user.ip[0].query,
            time: user.updatedAt,
            email: user.email
          })
          .then(html => {
            console.log('' + html.subject);
            console.log('' + html.html);
            console.log('' + process.env.COINOTC_FROM_EMAIL);
            console.log('' + user.email);
            var data = {
              from: process.env.COINOTC_FROM_EMAIL,
              to: user.email,
              subject: html.subject,
              html: html.html
            };
            console.log(data);
            mailgun.messages().send(data, function (err, body) {
              if (err) {
                console.log('got an error: ', err);
                res.status(500).send(err);
              } else {
                console.log(body);
                //res.status(201).json({ user: user.toAuthJSON(), body: body });
              }
            });
          })
          .catch(console.error);
      }
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON(), active: user.active });
    } else {
      console.log(info);
      console.log('---' + err);
      res.status(500).json(info);
      return;
    }
  })(req, res, next);
});

function handleHashPassword(err, result, res, currentPassword) {
  console.log(result.hash);
  var fromChangePasswordhash = crypto
    .pbkdf2Sync(currentPassword, result.salt, 10000, 512, 'sha512')
    .toString('hex');

  console.log(result.hash === fromChangePasswordhash);
  if (result.hash === fromChangePasswordhash) {
    console.log('Password match !');
    return res.status(200).json(1);
  } else {
    console.log('doesnt match !');
    return res.status(200).json(0);
  }
}

router.post('/users/checkChangePasswordUser', auth.required, function (
  req,
  res,
  next
) {
  let email = req.body.user.email;
  let currentPassword = req.body.currentPassword;
  console.log(email);
  console.log(currentPassword);
  User.findOne({ email: email }, 'hash salt', (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
      return;
    }
    handleHashPassword(err, user, res, currentPassword);
  });
});

router.post('/users/checkUser', function (req, res, next) {
  let username = req.body.user.username.toLowerCase();
  let email = req.body.user.email;
  User.find(
    { $or: [{ username: `${username}` }, { email: `${email}` }] },
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
        return;
      }
      res.status(200).json(result.length);
    }
  );
});

function handleChangePassword(err, result, res, currentPassword, newPassword) {
  console.log(result.hash);
  var fromChangePasswordhash = crypto
    .pbkdf2Sync(currentPassword, result.salt, 10000, 512, 'sha512')
    .toString('hex');
  let newPasswordUser = new User();
  newPasswordUser.setPassword(newPassword);
  console.log(result.hash === fromChangePasswordhash);
  if (result.hash === fromChangePasswordhash) {
    console.log('Password match !');
    console.log('NEW PASSWORD > ' + newPasswordUser.hash);
    console.log('NEW SALT > ' + newPasswordUser.salt);
    result.hash = newPasswordUser.hash;
    result.salt = newPasswordUser.salt;
    return result.save().then(function () {
      return res.json({ user: result.toAuthJSON() });
    });
  } else {
    console.log('doesnt match !');
    console.log(err);
    res.status(500).send(err);
    return;
  }
}

router.post('/users/change-password', auth.required, function (req, res, next) {
  let email = req.body.user.email;
  let currentPassword = req.body.passwordData.oldPassword;
  let newPassword = req.body.passwordData.newPassword;

  User.findOne({ email: email }, 'hash salt', (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
      return;
    }
    handleChangePassword(err, user, res, currentPassword, newPassword);
  });
});

router.post('/users/forgetPassword', function (req, res, next) {
  const code = Number(
    Math.floor(Math.random() * 9 + 1).toString() +
    Math.floor(Math.random() * 10).toString() +
    Math.floor(Math.random() * 10).toString() +
    Math.floor(Math.random() * 10).toString() +
    Math.floor(Math.random() * 10).toString() +
    Math.floor(Math.random() * 10).toString()
  );
  User.findOne({ email: req.body.email.email }, (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (result == null) res.status(200).json(result);
    else {
      User.findOneAndUpdate(
        { email: req.body.email.email },
        { code: code },
        { new: true }
      )
        .then(function (user) {
          console.log(user);
          var mailgun = new Mailgun({
            apiKey: sendEmail.api_key,
            domain: sendEmail.domain
          });
          //console.log(result)
          console.log(user.code);
          email
            .renderAll('forgetpassword', {
              name: user.username,
              code: user.code
            })
            .then(html => {
              var data = {
                from: process.env.COINOTC_FROM_EMAIL,
                to: user.email,
                subject: html.subject,
                html: html.html
              };
              mailgun.messages().send(data, function (err, body) {
                if (err) {
                  console.log('got an error: ', err);
                  return res.status(500).send(err);
                } else {
                  console.log(body);
                  console.log(err);
                  return res
                    .status(201)
                    .json({ user: user.toAuthJSON(), body: body });
                }
              });
            })
            .catch(console.error);
        })
        .catch(error => {
          res.status(500).send(error);
          return;
        });
    }
  });
});

router.post('/users/forgetVerifySixPin', function (req, res, nest) {
  User.findOne({ email: req.body.email })
    .then(function (user) {
      if (req.body.code === user.code) {
        User.findOneAndUpdate(
          { email: req.body.email },
          { code: null },
          { new: true },
          (err, result) => {
            if (err) res.status(500).json(err);
            if (user.code === req.body.code) res.status(201).json('success');
            else return res.status(201).json(err);
          }
        );
      } else res.status(201).json('Varification code is not correct');
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error);
      return;
    });
});
router.post('/users/confirmTradePasswordCode', function (req, res, nest) {
  User.findOne({ email: req.body.email })
    .then(function (user) {
      if (req.body.code === user.code) {
        User.findOneAndUpdate(
          { email: req.body.email },
          { code: null },
          { new: true },
          (err, result) => {
            if (err) res.status(500).json(err);
            if (user.code === req.body.code) res.status(201).json('success');
            else return res.status(201).json(err);
          }
        );
      } else res.status(201).json('Varification code is not correct');
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error);
      return;
    });
});

router.post('/users/forgetTradePassword', function (req, res, next) {
  const code = Number(
    Math.floor(Math.random() * 9 + 1).toString() +
    Math.floor(Math.random() * 10).toString() +
    Math.floor(Math.random() * 10).toString() +
    Math.floor(Math.random() * 10).toString() +
    Math.floor(Math.random() * 10).toString() +
    Math.floor(Math.random() * 10).toString()
  );
  User.findOneAndUpdate(
    { email: req.body.email },
    { code: code },
    { new: true }
  )
    .then(function (user) {
      console.log(user);
      var mailgun = new Mailgun({
        apiKey: sendEmail.api_key,
        domain: sendEmail.domain
      });
      console.log(user.code);
      email
        .renderAll('forgettradepassword', {
          name: user.username,
          code: user.code
        })
        .then(html => {
          var data = {
            from: process.env.COINOTC_FROM_EMAIL,
            to: user.email,
            subject: html.subject,
            html: html.html
          };
          mailgun.messages().send(data, function (err, body) {
            if (err) {
              console.log('got an error: ', err);
              return res.status(500).send(err);
            } else {
              console.log(body);
              console.log(err);
              return res
                .status(201)
                .json({ user: user.toAuthJSON(), body: body });
            }
          });
        })
        .catch(console.error);
    })
    .catch(error => {
      res.status(500).send(error);
      return;
    });
});

router.post('/users', function (req, res, next) {
  console.log('--- Register ---- ');
  //console.log(req);
  console.log(req.body.ip + 'qqqqqqqqqqq');
  var user = new User();
  user.active = false;
  user.verifyStatus = 0;
  user.ratings = [];
  user.orderCount = '0';
  user.volume = '';
  user.following = [];
  user.followers = [];
  user.block = false;
  user.tfa = {
    effective: false,
    secret: {}
  };
  user.secretToken = randomstring.generate();
  console.log(req.body.tradepassword);
  user.secretToken = randomstring.generate();
  user.deviceToken = req.body.deviceToken;
  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.ip = req.body.ip;
  user.online = false;
  console.log(req.body.user.password);
  user.setPassword(req.body.user.password);
  user.setTradePassword(req.body.tradepassword);
  user
    .save()
    .then(function () {
      var mailgun = new Mailgun({
        apiKey: sendEmail.api_key,
        domain: sendEmail.domain
      });
      var regUrl = `${process.env.API_DOMAIN_URL}/users/verify?secretToken=${
        user.secretToken
        }`;
      email
        .renderAll('registration', {
          name: user.username,
          regConfirmUrl: regUrl,
          ip: user.ip[0].query
        })
        .then(html => {
          console.log('' + html.subject);
          console.log('' + html.html);
          console.log('' + process.env.COINOTC_FROM_EMAIL);
          console.log('' + user.email);
          var data = {
            from: process.env.COINOTC_FROM_EMAIL,
            to: user.email,
            subject: html.subject,
            html: html.html
          };
          console.log(data);
          mailgun.messages().send(data, function (err, body) {
            if (err) {
              console.log('got an error: ', err);
              return res.status(500).send(err);
            } else {
              console.log(body);
              return res
                .status(201)
                .json({ user: user.toAuthJSON(), body: body });
            }
          });
        })
        .catch(console.error);
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
    { username: req.query.username },
    'orderCount ratings volume deviceToken following followers tfa',
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
  console.log;
  //let username = req.query.username;
  let tradepassword = req.query.tradepassword;
  //let currentUser = req.user;
  //console.log('>>> ' + currentUser.username);
  console.log(req.query.username);
  User.findOne({ username: req.query.username }, (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    ///User.validTradePassword(req.query.tradepassword)

    res.status(200).json(result.validTradePassword(req.query.tradepassword));
  });
  // User.find({ username: `${username}` }, 'tradePrd', (err, result) => {
  //   if (err) {
  //     res.status(500).send(err);
  //     return;
  //   }
  //   res.status(200).json(result);
  // });
});

router.get('/users/logout', auth.required, function (req, res, next) {
  console.log(req.payload.id);
  let currentUser = req.user;
  console.log(currentUser);

  User.findByIdAndUpdate(req.payload.id, { online: false })
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }

      return user.logout().then(function () {
        res.json({ logoutdatetime: new Date() });
      });
      req.logout(); // clears the passport session
      req.session.destroy(); // destroys all session related data
    })
    .catch(next);
});

module.exports = router;
