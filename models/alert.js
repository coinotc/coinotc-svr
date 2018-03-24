var mongoose = require('mongoose');

module.exports = mongoose.model('alert', {
  username: String,
  crypto: String,
  price: Number,
  fiat: String,
  status: Boolean,
  above: Boolean,
  date: Date
});
