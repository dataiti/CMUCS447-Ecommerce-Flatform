const express = require('express');
const {
  getListAdressesByUser,
  addAddress,
  updateAddress,
  removeAddress,
  addressById,
  setupDefaultAddress,
  getAddressDefault,
} = require('../controllers/address');
const { userById } = require('../controllers/user');
const { verifyToken, isAdminSystem } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/list-addreeses/:userId', getListAdressesByUser);
router.get('/address-default/:userId', getAddressDefault);
router.post('/add-address/:userId', addAddress);
router.put('/update-address/:userId/:addressId', updateAddress);
router.put('/set-default/:userId/:addressId', setupDefaultAddress);
router.delete('/remove-address/:userId/:addressId', removeAddress);

router.param('addressId', addressById);
router.param('userId', userById);

module.exports = router;
