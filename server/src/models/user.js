const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

mongoose.plugin(slug);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      maxLength: 32,
    },
    displayName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      trim: true,
    },

    avatar: {
      type: String,
      default: 'https://res.cloudinary.com/doo78f14s/image/upload/v1677427616/CDIO2-project/dedault_jd3qnu.jpg',
    },
    facebookId: {
      type: String,
    },
    googleId: {
      type: String,
    },
    password: {
      type: String,
    },
    filename: {
      type: String,
      default: 'CDIO2-project/dedault_jd3qnu',
    },
    permissions: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    wishlistIds: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Store',
        },
      ],
      default: [],
    },
    addressIds: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Address',
        },
      ],
      default: [],
    },

    storeId: {
      type: String,
    },
    followingStoreIds: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Store',
        },
      ],
      default: [],
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
    status: {
      type: String,
      default: 'Active',
      enum: ['Active', 'Locked'],
    },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true, sparse: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isCorrectPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

userSchema.methods.createPasswordChangedToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
