const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    country: {
      type: String,
      trim: true,
      required: true,
      maxLength: 100,
      default: 'VN',
    },
    province: {
      type: String,
      trim: true,
      required: true,
      maxLength: 100,
    },
    district: {
      type: String,
      trim: true,
      required: true,
      maxLength: 100,
    },
    ward: {
      type: String,
      trim: true,
      required: true,
      maxLength: 100,
    },
    exactAddress: {
      type: String,
      trim: true,
      required: true,
      maxLength: 300,
    },
    phone: {
      type: String,
      trim: true,
    },
    isDefaultAddress: {
      type: Boolean,
      default: false,
    },
    displayName: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Address', addressSchema);
