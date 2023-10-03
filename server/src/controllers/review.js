const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

const Review = require('../models/review');
const Product = require('../models/product');
const Store = require('../models/store');

const reviewById = asyncHandler(async (req, res, next, id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid)
    return res.status(400).json({
      success: true,
      message: 'Id is invalid',
    });

  const review = await Review.findById(id);

  if (!review)
    return res.status(400).json({
      success: true,
      message: 'This review is not found',
    });

  req.review = review;
  next();
});

const createReview = asyncHandler(async (req, res, next) => {
  const { content, rating, storeId, productId, orderId } = req.body;
  const listImages = req.files && req.files.map((item) => item.path);
  const filenameImages = req.files && req.files.map((item) => item.filename);

  if (!content || !rating || !storeId || !productId || !orderId) {
    throw new Error('All fields are required');
  }

  const newReview = new Review({
    content,
    rating: Number(rating),
    productId,
    orderId,
    listImages,
    filenameImages,
    storeId,
    authorId: req.user._id,
  });

  await newReview.save();

  if (!newReview) {
    filenameImages &&
      filenameImages.forEach(async (item) => {
        await cloudinary.uploader.destroy(item);
      });
    throw new Error('Create review is unsuccessfully');
  } else {
    next();
    return res.status(200).json({
      success: true,
      message: 'Create review is successfully',
      data: newReview,
    });
  }
});

const updateRatingForStoreAndProduct = asyncHandler(async (req, res) => {
  const { productId, storeId } = req.body;

  const reviewsProducts = await Review.aggregate([
    {
      $group: {
        _id: '$productId',
        rating: {
          $sum: '$rating',
        },
        count: { $sum: 1 },
      },
    },
  ]);

  if (!reviewsProducts) {
    throw new Error('Update Rating is failed');
  } else {
    const findProduct = reviewsProducts.find((r) => r._id.equals(productId));
    const rating = findProduct && parseFloat(findProduct.rating) / parseFloat(findProduct.count).toFixed(1);
    await Product.findOneAndUpdate({ _id: productId }, { $set: { rating } }, { new: true });
  }

  const reviewStores = await Review.aggregate([
    {
      $group: {
        _id: '$storeId',
        rating: {
          $sum: '$rating',
        },
        count: { $sum: 1 },
      },
    },
  ]);

  if (!reviewStores) {
    throw new Error('Update Rating is failed');
  } else {
    const findStore = reviewStores.find((r) => r._id.equals(storeId));
    const rating = findStore && parseFloat(findStore.rating) / parseFloat(findStore.count).toFixed(1);
    await Store.findOneAndUpdate({ _id: storeId }, { $set: { rating } }, { new: true });
  }
});

const updateReview = asyncHandler(async (req, res) => {});

const removeReview = asyncHandler(async (req, res) => {});

const getListReviewByProduct = asyncHandler(async (req, res) => {
  const sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt';
  const orderBy =
    req.query.orderBy && (req.query.orderBy == 'asc' || req.query.orderBy == 'desc') ? req.query.orderBy : 'desc';

  const limit = req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 4;
  const page = req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
  let skip = limit * (page - 1);

  const filterArgs = {
    productId: req.product._id,
    storeId: req.store._id,
  };

  if (req.query.rating && req.query.rating > 0 && req.query.rating < 6) {
    filterArgs.rating = parseInt(req.query.rating);
  }

  const totalReview = await Review.countDocuments(filterArgs);
  if (!totalReview) {
    return res.status(200).json({
      success: true,
      message: 'Get list review by product successfully',
      data: [],
    });
  }

  const count = totalReview;
  const pageCount = Math.ceil(count / limit);

  if (page > pageCount) {
    skip = (pageCount - 1) * limit;
  }

  const reviews = await Review.find(filterArgs)
    .sort({ [sortBy]: orderBy, _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate('authorId', '_id displayName username avatar')
    .populate('orderId', 'optionStyle');

  return res.status(200).json({
    success: true,
    message: 'Get list review by product successfully',
    // totalPage,
    currentPage: page,
    count: totalReview,
    data: reviews,
  });
});

module.exports = {
  reviewById,
  createReview,
  updateRatingForStoreAndProduct,
  updateReview,
  removeReview,
  getListReviewByProduct,
};
