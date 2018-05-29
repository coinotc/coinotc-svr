
var mongoose = require('mongoose');
var router = require('express').Router();
var moment = require('moment');

const apiurl = '/';

router.get("/serverside-time", (req,res)=>{
    var durationFromLocalTime =  moment.duration(moment(new Date(0)).diff(moment()));
    //console.log(moment.utc().format())
    var offsetSeconds = durationFromLocalTime.asSeconds()
    console.log("offsetSeconds:"+offsetSeconds)
    res.status(201).json(offsetSeconds);
})

module.exports = router;
