const express = require('express');
const {
  productById,
  createProduct,
  updateProduct,
  getProduct,
  removeProduct,
  getListHotSellingProducts,
  getOtherProductOfStore,
  getSearchProduct,
  getListProductsByUser,
  getListProductsByStore,
  getListProductsByCategory,
  getListHotSellingProductsByStore,
  getListProductsFromStoreByUser,
  getListProductsForAdmin,
} = require('../controllers/product');
const { storeById } = require('../controllers/store');
const { userById } = require('../controllers/user');
const uploadCloud = require('../configs/configCloudinary');
const { verifyToken, isOwnerStore, isAdminSystem } = require('../middlewares/verifyToken');

const router = express.Router();

// owner store
router.get('/list-hot-products/by-store/:storeId/:userId', getListHotSellingProductsByStore);
router.get('/list-products/last-7days/:storeId/:userId');
router.get('/list-products/by-store/:storeId/:userId', getListProductsByStore);
router.post('/create-product/:storeId/:userId', uploadCloud.array('images'), createProduct);
router.put('/update-product/:storeId/:productId', uploadCloud.array('images'), updateProduct);
router.delete('/delete-product/:storeId/:productId', removeProduct);

// user
router.get('/list-products/by-category', getListProductsByCategory);
router.get('/list-hot-products', getListHotSellingProducts);
router.get('/list-products/from-store/by-user/:storeId', getListProductsFromStoreByUser);
router.get('/list-products/by-user', getListProductsByUser);
router.get('/search/list-products/by-user', getSearchProduct);
router.get('/list-other-products/by-user/:storeId', getOtherProductOfStore);
router.get('/detail-product/:productId', getProduct);

// admin
router.get('/list-hot-products/admin/:userId', getListProductsForAdmin);

router.param('storeId', storeById);
router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
