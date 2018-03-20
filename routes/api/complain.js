
var router = require('express').Router();
var mongoose = require('mongoose');

var Complain = mongoose.model('complain');

const apiurl = '/';

router.post(apiurl, (req, res) => {
    let complain = req.body;
    let newComplain = new Complain();
    newComplain.complainant = complain.complainant;
    newComplain.orderId = complain.orderId;
    newComplain.pleader = complain.pleader;
    newComplain.type = complain.type;
    newComplain.content = complain.content;
    newComplain.status = 1;
    newComplain.support = "";
    newComplain.roomkey = "";
    newComplain.date = new Date();
    console.log(newComplain);
    let error = newComplain.validateSync();
    if (!error) {
        newComplain.save(function (err, result) {
            res.status(201).json(result);
        });
    } else {
        console.log(error);
        res.status(500).send(error);
    }
});
router.get(apiurl,(req,res)=>{
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
router.patch(apiurl+"roomkey", (req, res) => {
    console.log("patch roomkey"+req.body)
    console.log("patch roomkey"+req.query)
Complain.findOneAndUpdate({ _id: req.query.complainId},{ roomkey: req.body.roomkey },  (err, result) => {
        if (err) res.status(500).json(err);
        res.status(201).json(result);
      })
    });

module.exports = router;