const express = require('express');
const {
  userById,
  getUser,
  getProfile,
  updateProfile,
  replacePassword,
  updateAvatar,
  followStore,
  unFollowStore,
  deleteUser,
  getAllUserForAdmin,
} = require('../controllers/user');
const { storeById } = require('../controllers/store');
const uploadCloud = require('../configs/configCloudinary');
const { verifyToken, isAdminSystem } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/list-users/admin/:userId', getAllUserForAdmin);
router.get('/get-user/:userId', getUser);
router.get('/profile/:userId', getProfile);
router.put('/update-profile/:userId', updateProfile);
router.put('/replace-password/:userId', replacePassword);
router.put('/follow-store/:userId/:storeId', followStore);
router.put('/unfollow-store/:userId/:storeId', unFollowStore);
router.delete('/delete-user/:userId', deleteUser);

router.post('/upload-avatar/:userId', uploadCloud.single('avatar'), updateAvatar);

router.param('storeId', storeById);
router.param('userId', userById);

module.exports = router;
