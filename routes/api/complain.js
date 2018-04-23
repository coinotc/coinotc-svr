var router = require('express').Router();
var mongoose = require('mongoose');
var moment = require('moment');
var auth = require('../auth');
var Complain = mongoose.model('complain');

const apiurl = '/';

router.post(apiurl+"sendComplain", auth.required, (req, res) => {
    let complain = req.body;
    let newComplain = new Complain();
    newComplain.username = complain.username;
    newComplain.orderId = complain.orderId;
    newComplain.type = complain.type;
    newComplain.content = complain.content;
    newComplain.status = complain.status;
    newComplain.title = complain.title;
    newComplain.data = new Date(); 
    let error = newComplain.validateSync();
    if (!error) {
        Complain.findOne({username:complain.username,orderId:complain.orderId}, (err, result) => {
            if (err) {
                res.status(500).send(err);
                return; 
            }
            console.log(result)
            if(result != null){
                res.status(200).send("null")
                return;
            }
            //res.status(200).json(result);
            else{
            newComplain.save(function (err, result) {
                res.status(201).json(result);
            })
        }
        })
    } else {
        console.log(error);
        res.status(500).send(error);
    }
});

router.get(apiurl, auth.required, (req,res)=>{
    var query ={};
    let username = req.query.keyword;
    if (typeof username == 'undefined'|| username == "") {
        username = "";
    }
    if (username !== '') {
        query = { complainant: `${username}`}
    }
    Complain.find( query, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return; 
        }
        res.status(200).json(result);
    });
})
router.patch(apiurl+"roomkey", auth.required, (req, res) => {
    console.log("patch roomkey"+req.body)
    console.log("patch roomkey"+req.query)
Complain.findOneAndUpdate({ _id: req.query.complainId},{ roomkey: req.body.roomkey },  (err, result) => {
        if (err) res.status(500).json(err);
        res.status(201).json(result);
      })
    });

module.exports = router;