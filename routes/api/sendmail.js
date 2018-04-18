var mailgun = require("mailgun-js");
var api_key = 'key-e5b16dae5fb71157586d345c3df82e46';
var domain = 'mg.coinotc.market';
var render = require("render");
var auth = require('../auth');
var mongoose = require('mongoose');
var router = require('express').Router();
var randomstring = require('randomstring');
var User = mongoose.model('User');


const apiurl = '/';

router.post(apiurl, function(req,res) {
       console.log(req.query.email+"there is email")
       var secretToken = req.query.secretToken; 
      var mailgun = new Mailgun({apiKey: api_key, domain: domain});
      var data = {
        from: 'coinotc👻 <postmaster@mg.coinotc.market>',
//to: req.params.mail,
        to: req.query.email,
        subject: 'Hello from coinOTC',
        html: `Hi there,
        <br/>
        Thank you for registering!
        <br/><br/>
        Please verify your email by typing the following token:
        <br/>
        On the following page:
        <a href="https://coinotc.market/api/users/verify?secretToken=${secretToken}">click here</a>
        <br/><br/>
        Have a pleasant day.`
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


//     nodemailer.createTestAccount((err, account) => {
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//         service:'Zoho',
//         auth: {
//             user: 'admin@coinotc.market', 
//             pass: 'Modus123' 
//             // user: 'coinotc.market@gmail.com', 
//             // pass: 'Modus123' 
//         }
//     });

//     // setup email data with unicode symbols
//     let mailOptions = {
//         from: '"coinotc👻" <admin@coinotc.market>', // sender address
//         to: req.query.email, // list of receivers
//         subject: 'Hello ✔', // Subject line
//         text: 'Hello world?', // plain text body
//         html: `Hi there,
//         <br/>
//         Thank you for registering!
//         <br/><br/>
//         Please verify your email by typing the following token:
//         <br/>
//         On the following page:
//         <a href="https://coinotc.market/api/users/verify?secretToken=${secretToken}">click here</a>
//         <br/><br/>
//         Have a pleasant day.`  // html body
//     };

//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             res.status(500).json(err);
//         }
//         console.log('Message sent: %s', info.messageId);
//         // Preview only available when sending through an Ethereal account
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//         res.status(200).json(info);
//     });
// });



  });
module.exports = router; 