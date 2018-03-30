var mongoose = require('mongoose');

module.exports = mongoose.model('advertisement', {
    visible: Boolean,
    owner: String,
    crypto: String,
    country: String,
    fiat: String,
    price: Number,
    min_price: Number,
    max_price: Number,
    fiat: String,
    payment: String,
    limit: Number,
    message: String,
    deleteStatuts : Boolean,
    type: Number // 0 is sell ,1 is buy
});
