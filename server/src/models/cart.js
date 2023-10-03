const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    storeId: {
      type: mongoose.Types.ObjectId,
      ref: 'Store',
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
    },
    optionStyle: {
      type: Object,
      default: {},
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      default: 1,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Cart', cartSchema);
