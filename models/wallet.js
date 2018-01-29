var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var WalletSchema = new mongoose.Schema({
  email: { type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid']},
  cryptoAddress: { type: String, index: true, unique: true, required: true },
  cryptoCurrency: { type: String, index: true, unique: true, required: true },
  isDefault: Boolean,
  currentBalance: Number
}, { timestamps: true });

WalletSchema.plugin(uniqueValidator, { message: 'is already taken.' });


WalletSchema.methods.toAuthJSON = function () {
  return {
    email: this.email,
    cryptoAddress: this.cryptoAddress,
    cryptoCurrency: this.cryptoCurrency,
    isDefault: this.isDefault,
    currentBalance: this.currentBalance
  };
};



mongoose.model('Wallet', WalletSchema);