var mailgun = require("mailgun-js");
var api_key = 'key-43175e952d518dcf69a937bc4ff7cb2a';
var domain = 'sandboxe515817a071342c6b3f28d2de1ef3407.mailgun.org';
var render = require("render");
var auth = require('../auth');
var mongoose = require('mongoose');
var router = require('express').Router();
var randomstring = require('randomstring');
var nodemailer = require('nodemailer');
var User = mongoose.model('User');


const apiurl = '/';

router.get(apiurl, auth.required, function(req,res) {
       console.log(req.query.email+"there is email")
       var secretToken = req.query.secretToken; 
//       var mailgun = new Mailgun({apiKey: api_key, domain: domain});
//       var data = {
//         from: 'MrMoo <jiacheng.hou@lemo.io>',
// //to: req.params.mail,
//         to: 'douglas@lemo.io',
//         subject: 'Hello from coinOTC',
//         html: 'Welcome to coinOTC'
//       }

//       mailgun.messages().send(data, function (err, body) {

//           if (err) {
//               //res.render('error', { error : err});
//               console.log("got an error: ", err);
//                 res.status(500).send(err);
//           }
//           else {
//               //res.render('submitted', { email : req.params.mail });
//               console.log(body);
//               res.status(201).json(body);
//           }
//       });


nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service:'Zoho',
        auth: {
            user: 'admin@coinotc.market', 
            pass: 'Modus123' 
            // user: 'coinotc.market@gmail.com', 
            // pass: 'Modus123' 
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"coinotc👻" <admin@coinotc.market>', // sender address
        to: req.query.email, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: `Hi there,
        <br/>
        Thank you for registering!
        <br/><br/>
        Please verify your email by typing the following token:
        <br/>
        On the following page:
        <a href="https://coinotc.market/api/users/verify?secretToken=${secretToken}">click here</a>
        <br/><br/>
        Have a pleasant day.`  // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});



  });
module.exports = router; 