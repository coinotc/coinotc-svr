var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true
    },
    bio: String,
    image: String,
    orderCount: Number,
    ratings: Array,
    volume: String,
    logoutDateTime: Date,
    phone: Number,
    following: Array,
    followers: Array,
    hash: String,
    salt: String,
    tradePasswordSalt:String,
    tradePasswordHash:String,
    baseCurrency: String,
    preferLanguage: String,
    nativeRegion: String,
    deviceToken: String,
    tfa: Object,
    secretToken :String,
    active:Boolean,
    block :Boolean,
    code:Number,
    verifyStatus:Number,
    passport:String,
    firstName:String,
    lastName:String,
    gender:String,
    country:String,
    ip:Array,
    online:Boolean,
    verifyKYCName:Number,
    verifyPassportPhoto:Number,
    verifySelfie:Number,
    passportPhoto:String,
    selfiePhoto:String
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserSchema.methods.validPassword = function(password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
};

UserSchema.methods.setTradePassword = function(tradePassword) {
  this.tradePasswordSalt = crypto.randomBytes(16).toString('hex');
  this.tradePasswordHash = crypto
    .pbkdf2Sync(tradePassword, this.tradePasswordSalt, 10000, 512, 'sha512')
    .toString('hex');
};

UserSchema.methods.validTradePassword = function(tradePassword) {
  var tradePasswordHash = crypto
    .pbkdf2Sync(tradePassword, this.tradePasswordSalt, 10000, 512, 'sha512')
    .toString('hex');
  return this.tradePasswordHash === tradePasswordHash;
};

UserSchema.methods.generateJWT = function() {
  var today = new Date();
  console.log(today)
  var exp = new Date(today);
  console.log(exp)
  exp.setDate(today.getDate() + 60);
  console.log(exp)
  console.log(today.getDate())
  console.log(exp.setDate(today.getDate() + 60))
  console.log(exp.getTime() / 1000)
  console.log(1111111111111111111111111111)
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000)
    },
    secret
  );
};

UserSchema.methods.toAuthJSON = function() {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image,
    orderCount: this.orderCount,
    ratings: this.ratings,
    following: this.following,
    followers: this.followers,
    nativeCurrency: this.baseCurrency,
    nativeCountry: this.country
  };
};

UserSchema.methods.toProfileJSONFor = function(user) {
  return {
    username: this.username,
    email: this.email
  };
};

UserSchema.methods.logout = function() {
  this.logoutDateTime = new Date();
  return this.save();
};

UserSchema.methods.isFollowing = function(id) {
  return this.following.some(function(followId) {
    return followId.toString() === id.toString();
  });
};

mongoose.model('User', UserSchema);
