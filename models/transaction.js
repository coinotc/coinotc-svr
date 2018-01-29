var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var TransactionSchema = new mongoose.Schema({
  owner: String,
  fromAddress: String,
  toAddress: String,
  cryptoCurrency: String,
  refundAddress: String,
  unit: Number,
  closePrice: Number,
  transactionDate: Date,
  status: Number,
  baseCurrency: String
}, { timestamps: true });

TransactionSchema.plugin(uniqueValidator, { message: 'is already taken.' });


mongoose.model('Transaction', TransactionSchema);
