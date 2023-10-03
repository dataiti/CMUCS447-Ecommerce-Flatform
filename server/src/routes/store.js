const express = require('express');
const {
  storeById,
  getStore,
  getProfileStore,
  createStore,
  updateStore,
  updateAvatar,
  getListFeatureImages,
  addFeatureImage,
  updateFeatureImage,
  removeFeatureImage,
  getListStoresForAdmin,
  getListStoresByUser,
  setLayoutFeatureImage,
  setShowHotProductSelling,
} = require('../controllers/store');
const { userById } = require('../controllers/user');
const uploadCloud = require('../configs/configCloudinary');
const { verifyToken, isAdminSystem } = require('../middlewares/verifyToken');

const router = express.Router();

// admin
router.get('/list-stores/admin/:userId', getListStoresForAdmin);

// store
router.get('/list-stores/by/user/:userId', getListStoresByUser);
router.get('/get-store/:storeId', getStore);
router.get('/profile-store/:storeId/:userId', getProfileStore);
router.post('/create-store/:userId', uploadCloud.single('avatar'), createStore);
router.put('/set-layout-store/:storeId/:userId', setLayoutFeatureImage);
router.put('/set-show-products-selling/:storeId/:userId', setShowHotProductSelling);
router.put('/update-store/:storeId/:userId', updateStore);
router.put('/update-avatat-store/:storeId/:userId', uploadCloud.single('avatar'), updateAvatar);

// feature image
router.get('/list-feature-image/:storeId/:userId', getListFeatureImages);
router.post('/add-feature-image/:storeId/:userId', uploadCloud.array('images'), addFeatureImage);
router.put('/update-feature-image/:storeId/:userId', uploadCloud.single('image'), updateFeatureImage);
router.delete('/remove-feature-image/:storeId/:userId', removeFeatureImage);

// param
router.param('userId', userById);
router.param('storeId', storeById);

module.exports = router;
