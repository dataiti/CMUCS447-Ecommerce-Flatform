const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    payerId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: 'Store',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      enum: ['USD', 'VND'],
      default: 'USD',
    },
    transactionMethod: {
      type: String,
      enum: ['PayPal', ''],
      default: 'PayPal',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Transaction', transactionSchema);
