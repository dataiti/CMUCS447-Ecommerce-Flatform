const express = require('express');
const {
  orderById,
  createOrder,
  updateStatusOrderByStore,
  cancelOrder,
  getOrderStatusByStore,
  getOrderStatusByUSer,
  getDetailOrder,
  getOrderStatusForAdmin,
} = require('../controllers/order');
const { userById } = require('../controllers/user');
const { storeById } = require('../controllers/store');
const { verifyToken, isOwnerStore, isAdminSystem } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/get-orders/admin/:userId', getOrderStatusForAdmin);
router.get('/get-orders/detail/:orderId', getDetailOrder);
router.get('/get-orders-status/by-user/:userId', getOrderStatusByUSer);
router.get('/get-orders-status/by-store/:storeId', getOrderStatusByStore);
router.post('/create-order/:userId', createOrder);
router.put('/cancel-order/:userId/:orderId', cancelOrder);
router.put('/update-status-order/:storeId/:orderId', updateStatusOrderByStore);

// param
router.param('userId', userById);
router.param('storeId', storeById);
router.param('orderId', orderById);

module.exports = router;
