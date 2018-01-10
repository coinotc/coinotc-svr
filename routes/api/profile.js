var router = require('express').Router();
var mongoose = require('mongoose');
// var User = mongoose.model('User');
// var auth = require('../auth');

var Profile = mongoose.model('profile');
const apiurl = '/';

// Preload user profile on routes with ':username'
// router.param('username', function(req, res, next, username){
//   User.findOne({username: username}).then(function(user){
//     if (!user) { return res.sendStatus(404); }

//     req.profile = user;

//     return next();
//   }).catch(next);
// });

// router.get('/:username', auth.optional, function(req, res, next){
//   if(req.payload){
//     User.findById(req.payload.id).then(function(user){
//       if(!user){ return res.json({profile: req.profile.toProfileJSONFor(false)}); }

//       return res.json({profile: req.profile.toProfileJSONFor(user)});
//     });
//   } else {
//     return res.json({profile: req.profile.toProfileJSONFor(false)});
//   }
// });

// router.post('/:username/follow', auth.required, function(req, res, next){
//   var profileId = req.profile._id;

//   User.findById(req.payload.id).then(function(user){
//     if (!user) { return res.sendStatus(401); }

//     return user.follow(profileId).then(function(){
//       return res.json({profile: req.profile.toProfileJSONFor(user)});
//     });
//   }).catch(next);
// });

// router.delete('/:username/follow', auth.required, function(req, res, next){
//   var profileId = req.profile._id;

//   User.findById(req.payload.id).then(function(user){
//     if (!user) { return res.sendStatus(401); }

//     return user.unfollow(profileId).then(function(){
//       return res.json({profile: req.profile.toProfileJSONFor(user)});
//     });
//   }).catch(next);
// });

router.post(apiurl, (req, res) => {
  let profile = req.body;
  console.log(profile);
  let newProfile = new Profile();
  newProfile.username = profile.username;
  newProfile.trades = 0;
  newProfile.volume = 0;
  newProfile.goodCount = 0;
  let error = newProfile.validateSync();
  if (!error) {
    newProfile.save(function (err, result) {
        res.status(201).json(result);
    });
} else {
    console.log(error);
    res.status(500).send(error);
}
});
module.exports = router;
