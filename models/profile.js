var mongoose = require('mongoose');

module.exports = mongoose.model('profile', {
    username: String,
    trades: Number,
    volume: Number,
    goodCount: Number,
});
