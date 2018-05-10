var mongoose = require('mongoose');

module.exports = mongoose.model('notification', {
  username:String,
  message:String
});
