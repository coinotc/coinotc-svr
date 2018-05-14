var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Notification = require('./notification');
var MongooseTrigger = require('mongoose-trigger');

let OrderInformationSchema = new Schema({
  buyer: String,
  seller: String,
  owner: String,
  crypto: String,
  country: String,
  quantity: Number,
  price: Number,
  amount: Number,
  fiat: String,
  payment: String,
  limit: Number,
  message: String,
  buyerRating: Number,
  sellerRating: Number,
  finished: Number,
  date: Date,
  informDate: Date,
  approveDate: Date,
  ratingDate: Date,
  roomkey: String
});

const OrderEvents = MongooseTrigger(OrderInformationSchema, {
  events: {
    create: {},
    update: {
      select: 'finished'
    }
  },
  debug: true
});

OrderEvents.on('create', data => console.log('[create] says:', data));
OrderEvents.on('update', data => {
  console.log('[update] says:', data);
  let order = mongoose.model('orderInformation', OrderInformationSchema);
  order.findOne({ _id: data._id }, function(err, res) {
    if (err) throw err;
    if (data.finished == 2) {
      let notification = new Notification();
      notification.username = res.seller;
      notification.message = `Your Order ${res._id} with ${
        res.buyer
      } has progress!`;
      let error = notification.validateSync();
      if (!error) {
        notification.save();
      }
    } else if (data.finished == 3) {
      let notification = new Notification();
      notification.username = res.buyer;
      notification.message = `Your Order ${res._id} with ${
        res.seller
      } has progress!`;
      let error = notification.validateSync();
      if (!error) {
        notification.save();
      }
    }
  });
});

module.exports = {
  orderInformation: mongoose.model('orderInformation', OrderInformationSchema)
};
