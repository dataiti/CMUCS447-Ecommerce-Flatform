const express = require('express');
const {
  getRevenueLast7Days,
  getTotalRevenue,
  getRevenueLast30Days,
  getTodoList,
  getRevenueByMonth,
  getRankProductByRevenue,
  getRankProductByCount,
  getRankCustomer,
  getParameterOfCategoryForAdmin,
  getParameterOfRegionForAdmin,
  getParameterTotalOfSystemForAdmin,
  getRevenueMonthsOfYearForAdmin,
  getRevenueLast30DaysForAdmin,
  getRankOfRevenueStoresForAdmin,
  getIndexTotalOfSystemForAdmin,
  getRevenueLast7DaysForAmin,
} = require('../controllers/revenue');
const { userById } = require('../controllers/user');
const { orderById } = require('../controllers/order');
const { storeById } = require('../controllers/store');
const { isAdminSystem } = require('../middlewares/verifyToken');

const router = express.Router();

// owner store
router.get('/get-revenue/last-7-days/:storeId', getRevenueLast7Days);
router.get('/get-revenue/last-30-days/:storeId', getRevenueLast30Days);
router.get('/get-total-revenue/:storeId', getTotalRevenue);
router.get('/get-revenue/month/:storeId', getRevenueByMonth);
router.get('/get-todo-list/:storeId', getTodoList);
router.get('/get-rank-product/by-revenue/:storeId', getRankProductByRevenue);
router.get('/get-rank-product/by-count/:storeId', getRankProductByCount);
router.get('/get-rank-customer/by-spending/:storeId', getRankCustomer);

// admin
router.get('/get-revenue/by-months/admin/:userId', getRevenueMonthsOfYearForAdmin);
router.get('/get-parameter/by-category/admin/:userId', getParameterOfCategoryForAdmin);
router.get('/get-parameter/by-region/admin/:userId', getParameterOfRegionForAdmin);
router.get('/get-parameter/by-total/admin/:userId', getParameterTotalOfSystemForAdmin);
router.get('/get-revenue/last-30days/admin/:userId', getRevenueLast30DaysForAdmin);
router.get('/get-rank-revenue/by-store/admin/:userId', getRankOfRevenueStoresForAdmin);
router.get('/get-index-total/admin/:userId', getIndexTotalOfSystemForAdmin);
router.get('/get-revenue/last-7-days/admin/:userId', getRevenueLast7DaysForAmin);

// param
router.param('userId', userById);
router.param('storeId', storeById);
router.param('orderId', orderById);

module.exports = router;
