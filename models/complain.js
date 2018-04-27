var mongoose = require('mongoose');

module.exports = mongoose.model('complain', {
    username: String,
    orderId: String,
    admin: String,
    type: String,
    content: String,
    status:Number,
    message:[{
        content:String,
        date:Date,
        role:String
    }],
    createDate:Date,
    title:String
});
