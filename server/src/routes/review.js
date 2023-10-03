const express = require('express');
const {
  reviewById,
  createReview,
  updateRatingForStoreAndProduct,
  getListReviewByProduct,
  removeReview,
  updateReview,
} = require('../controllers/review');
const { orderById } = require('../controllers/order');
const { productById } = require('../controllers/product');
const { userById } = require('../controllers/user');
const { storeById } = require('../controllers/store');
const uploadCloud = require('../configs/configCloudinary');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/list-reviews/by-product/:productId/:storeId', getListReviewByProduct);
router.post(
  '/create-review/:userId',
  verifyToken,
  uploadCloud.array('images'),
  createReview,
  updateRatingForStoreAndProduct,
);

// param
router.param('userId', userById);
router.param('reviewId', reviewById);
router.param('storeId', storeById);
router.param('orderId', orderById);
router.param('productId', productById);

module.exports = router;
