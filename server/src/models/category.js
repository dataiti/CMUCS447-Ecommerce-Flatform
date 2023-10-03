const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 32,
    },
    slug: {
      type: String,
      slug: 'name',
      unique: true,
    },
    filenameImage: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'Active',
      enum: ['Active', 'Banned'],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Category', categorySchema);
