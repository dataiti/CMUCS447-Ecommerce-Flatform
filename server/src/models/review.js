const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
    },
    storeId: {
      type: mongoose.Types.ObjectId,
      ref: 'Store',
    },
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: 'Order',
    },
    filenameImages: {
      type: Array,
      default: [],
    },
    listImages: {
      type: Array,
      default: [],
    },
    content: {
      type: String,
      trim: true,
      maxLength: 1000,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Review', reviewSchema);
