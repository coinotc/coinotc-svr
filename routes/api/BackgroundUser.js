var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('BackgroundUser');
var auth = require('../auth');


router.post('/login', function (req, res, next) {
    let user = req.body.user;
    // if (!req.body.user.email) {
    //     return res.status(422).json({ errors: { email: "can't be blank" } });
    // }
    // if (!req.body.user.password) {
    //     return res.status(422).json({ errors: { password: "can't be blank" } });
    // }
    // passport.authenticate('local', { session: true }, function (err, user, info) {
    //     if (err) {
    //         return next(err);
    //     }
    //     if (user) {
    //         console.log(user);
    //         user.token = user.generateJWT();
    //         return res.json({ user: user.toAuthJSON() });
    //     } else {
    //         console.log(info);
    //         return res.status(422).json(info);
    //     }
    // })(req, res, next);
    User.findOne({ email: user.email },(err,result)=>{
        if(!result || !result.validPassword(user.password)){
            res.status(500).send('email or password is invalid')
        }else{
            if(result){
                console.log(result);
                result.token = result.generateJWT();
                return res.json({ user: user.toAuthJSON() });
            }else{
                console.log(info);
                return res.status(422).json(info);
            }
        }
    })
});

router.post('/reg', function (req, res, next) {
    var user = new User();
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);
    user
        .save()
        .then(function () {
            return res.json({ user: user.toAuthJSON() });
        })
        .catch(next);
});

module.exports = router;
