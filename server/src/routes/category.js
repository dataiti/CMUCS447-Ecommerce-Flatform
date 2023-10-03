const express = require('express');
const {
  categoryById,
  getCategory,
  createCategory,
  updateCategory,
  removeCategory,
  getListCategories,
  getListCategoriesForAdmin,
} = require('../controllers/category');
const { userById } = require('../controllers/user');
const uploadCloud = require('../configs/configCloudinary');
const { verifyToken, isAdminSystem } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/list-categories/admin/:userId', verifyToken, isAdminSystem, getListCategoriesForAdmin);
router.get('/list-categories', getListCategories);
router.get('/get-category/:categoryId', verifyToken, isAdminSystem, getCategory);
router.post('/create-category', verifyToken, isAdminSystem, uploadCloud.single('image'), createCategory);
router.put('/update-category/:categoryId', verifyToken, isAdminSystem, uploadCloud.single('image'), updateCategory);
router.delete('/remove-category/:categoryId', verifyToken, isAdminSystem, removeCategory);

router.param('categoryId', categoryById);
router.param('userId', userById);

module.exports = router;
