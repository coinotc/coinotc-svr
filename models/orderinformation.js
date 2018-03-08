var mongoose = require('mongoose');

module.exports = mongoose.model('orderInformation', {
    buyer: String,
    seller: String,
    crypto: String,
    country: String,
    quantity: Number,
    price: Number,
    amount: Number,
    fiat: String,
    payment: String,
    limit: Number,
    finished: Boolean,
    date: Date,
    roomkey: String
});
