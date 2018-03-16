var mailgun = require("mailgun-js");
var api_key = 'key43175e952d518dcf69a937bc4ff7cb2a';
var domain = 'sandboxe515817a071342c6b3f28d2de1ef3407.mailgun.org';
var render = require("render")
// var mailgun = require('mailgunjs')({apiKey: api_key, domain: DOMAIN});

// var data = {
//   from: 'MrMoo <jiacheng.hou@lemo.io>',
//   to: 'hjchoujiacheng@126.com, hjc@sandboxe515817a071342c6b3f28d2de1ef3407.mailgun.org',
//   subject: 'Hello',
//   text: 'Testing some Mailgun awesomness!'
// };

// mailgun.messages().send(data, function (error, body) {
//   console.log(body);
// });
var mongoose = require('mongoose');
var router = require('express').Router();

const apiurl = '/';

router.get(apiurl, function(req,res) {
      console.log(req.query.email+"there is email")
      var mailgun = new Mailgun({apiKey: api_key, domain: domain});
      var data = {
        from: 'MrMoo <jiacheng.hou@lemo.io>',
//to: req.params.mail,
        to: '1447379207@qq.com',
        subject: 'Hello from coinOTC',
        html: 'Welcome to coinOTC'
      }

      mailgun.messages().send(data, function (err, body) {

          if (err) {
              //res.render('error', { error : err});
              console.log("got an error: ", err);
                res.status(500).send(err);
          }
          else {
              //res.render('submitted', { email : req.params.mail });
              console.log(body);
              res.status(201).json(body);
          }
      });
  
  });
module.exports = router; 