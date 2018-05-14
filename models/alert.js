var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Notification = require('./notification');
var MongooseTrigger = require('mongoose-trigger');

let AlertSchema = new Schema({
  username: String,
  crypto: String,
  price: Number,
  fiat: String,
  status: Boolean,
  above: Boolean,
  date: Date
});

const AlertEvents = MongooseTrigger(AlertSchema, {
  events: {
    create: {},
    update: {
      select: 'status'
    },
    remove: true
  },
  debug: true
});

AlertEvents.on('create', data => console.log('[create] says:', data));
AlertEvents.on('update', data => {
  console.log('[update] says:', data);
  if (data.status == false) {
    let alert = mongoose.model('alert', AlertSchema);
    alert.findOne({ _id: data._id }, function(err, res) {
      if (err) throw err;
      let notification = new Notification();
      notification.username = res.username;
      notification.message = `Your ${res.crypto} in ${
        res.fiat
      } which price is ${res.price}, has reached!`;
      let error = notification.validateSync();
      if (!error) {
        notification.save();
      }
    });
  }
});
AlertEvents.on('remove', data => console.log('[remove] says:', data));

module.exports = {
  alert: mongoose.model('alert', AlertSchema)
};
