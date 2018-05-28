var mongoose = require('mongoose');
var router = require('express').Router();
var moment = require('moment');

const apiurl = '/';

router.get("/serverside-time", (req,res)=>{
    var durationFromLocalTime =  moment.duration(moment(moment.utc()).diff(moment()));
    var offsetSeconds = durationFromLocalTime.asSeconds()
    console.log(offsetSeconds)
    res.status(201).json(offsetSeconds);
})

module.exports = router;
