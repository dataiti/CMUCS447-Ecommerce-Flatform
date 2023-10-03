const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const moment = require('moment');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const Store = require('../models/store');
const Category = require('../models/category');
const { months } = require('../helper/constant');

const getRevenueLast7Days = asyncHandler(async (req, res) => {
  const sevenDaysAgo = moment().subtract(7, 'days').startOf('day').toDate();
  const today = moment().endOf('day').toDate();

  const result = await Order.aggregate([
    {
      $match: {
        status: 'Delivered',
        createdAt: { $gte: sevenDaysAgo, $lte: today },
        storeId: req.store._id,
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return res.status(200).json({
    success: true,
    message: 'Get revenue last 7 day status successfully',
    data: result,
  });
});

const getRevenueLast30Days = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = moment().subtract(30, 'days').startOf('day').toDate();
  const today = moment().endOf('day').toDate();

  const result = await Order.aggregate([
    {
      $match: {
        status: 'Delivered',
        createdAt: { $gte: thirtyDaysAgo, $lte: today },
        storeId: req.store._id,
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return res.status(200).json({
    success: true,
    message: 'Get revenue last 7 day status successfully',
    data: result,
  });
});

const getTotalRevenue = asyncHandler(async (req, res) => {
  const startOfToday = moment().startOf('day');
  const endOfToday = moment().endOf('day');

  const resultToday = await Order.aggregate([
    {
      $match: {
        status: 'Delivered',
        storeId: req.store._id,
        createdAt: { $gte: startOfToday.toDate(), $lte: endOfToday.toDate() },
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: '$totalPrice' },
      },
    },
  ]);

  const todayRevenue = resultToday.length > 0 ? resultToday[0].revenue : 0;

  const startOfMonth = moment().startOf('month');
  const endOfMonth = moment().endOf('month');

  const resultMonth = await Order.aggregate([
    {
      $match: {
        status: 'Delivered',
        storeId: req.store._id,
        createdAt: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() },
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: '$totalPrice' },
      },
    },
  ]);
  const monthRevenue = resultMonth.length > 0 ? resultMonth[0].revenue : 0;

  const startOfYear = moment().startOf('year');
  const endOfYear = moment().endOf('year');

  const resultYear = await Order.aggregate([
    {
      $match: {
        status: 'Delivered',
        storeId: req.store._id,
        createdAt: { $gte: startOfYear.toDate(), $lte: endOfYear.toDate() },
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: '$totalPrice' },
      },
    },
  ]);
  const yearRevenue = resultYear.length > 0 ? resultYear[0].revenue : 0;

  const resultTotal = await Order.aggregate([
    {
      $group: {
        _id: null,
        revenue: { $sum: '$totalPrice' },
      },
    },
  ]);
  const totalRevenue = resultTotal.length > 0 ? resultTotal[0].revenue : 0;

  return res.status(200).json({
    success: true,
    message: 'Get total revenue is successfully',
    data: {
      todayRevenue,
      monthRevenue,
      yearRevenue,
      totalRevenue,
    },
  });
});

const getRevenueByMonth = asyncHandler(async (req, res) => {
  const year = moment().year();
  const startOfYear = moment([year, 0, 1]).startOf('day').toDate();
  const endOfYear = moment([year, 11, 31]).endOf('day').toDate();

  const result = await Order.aggregate([
    {
      $match: {
        status: 'Delivered',
        createdAt: { $gte: startOfYear, $lte: endOfYear },
        storeId: req.store._id,
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$totalPrice' },
      },
    },
  ]);

  const updatedMonths = months.map((month) => {
    const matchingResult = result.find((item) => item._id === month._id);
    if (matchingResult) {
      return { ...month, revenue: matchingResult.revenue };
    }
    return month;
  });

  return res.status(200).json({
    success: true,
    message: 'Get revenue by month successfully',
    data: updatedMonths,
  });
});

const getTodoList = asyncHandler(async (req, res) => {
  const count = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

  return res.status(200).json({
    success: true,
    message: 'Get toto list successfully',
    data: count,
  });
});

const getRevenueForToday = asyncHandler(async (req, res) => {});

const getRevenueForYesterday = asyncHandler(async (req, res) => {});

const getRankProductByRevenue = asyncHandler(async (req, res) => {
  let result = await Order.aggregate([
    {
      $match: {
        status: 'Delivered',
        storeId: req.store._id,
      },
    },
    {
      $group: {
        _id: '$productId',
        totalPrice: {
          $sum: '$totalPrice',
        },
      },
    },
    {
      $sort: { totalPrice: -1 },
    },
  ]);

  const productIds = result.map((item) => item._id);

  const populatedResult = await Promise.all(
    productIds.map((productId) => Product.findById(productId).select('name price imagePreview')),
  );

  result = result.map((item, index) => {
    const product = populatedResult[index];
    return {
      ...item,
      product: product,
    };
  });

  return res.status(200).json({
    success: true,
    message: 'Get rank product by revenue successfully',
    data: result,
  });
});

const getRankProductByCount = asyncHandler(async (req, res) => {
  let result = await Order.aggregate([
    {
      $match: {
        status: 'Delivered',
        storeId: req.store._id,
      },
    },
    {
      $group: {
        _id: '$productId',
        value: {
          $sum: '$quantity',
        },
      },
    },
    {
      $sort: { quantity: -1 },
    },
  ]);

  const productIds = result.map((item) => item._id);

  const populatedResult = await Promise.all(
    productIds.map((productId) => Product.findById(productId).select('name price imagePreview')),
  );

  result = result.map((item, index) => {
    const product = populatedResult[index];
    return {
      ...item,
      product: product,
    };
  });

  return res.status(200).json({
    success: true,
    message: 'Get rank product by revenue successfully',
    data: result,
  });
});

const getRankCustomer = asyncHandler(async (req, res) => {
  let result = await Order.aggregate([
    {
      $match: {
        status: 'Delivered',
        storeId: req.store._id,
      },
    },
    {
      $group: {
        _id: '$userId',
        value: {
          $sum: '$totalPrice',
        },
      },
    },
    {
      $sort: { quantity: -1 },
    },
  ]);

  const userIds = result.map((item) => item._id);

  const populatedResult = await Promise.all(
    userIds.map((userId) =>
      User.findOne({ _id: userId }).populate('addressIds', 'province').select('displayName email avatar addressIds'),
    ),
  );

  result = result.map((item, index) => {
    const user = populatedResult[index];
    return {
      ...item,
      user: user,
    };
  });

  return res.status(200).json({
    success: true,
    message: 'Get rank product by revenue successfully',
    data: result,
  });
});

const getRevenueMonthsOfYearForAdmin = asyncHandler(async (req, res) => {
  const year = moment().year();
  const startOfYear = moment([year, 0, 1]).startOf('day').toDate();
  const endOfYear = moment([year, 11, 31]).endOf('day').toDate();

  const result = await Order.aggregate([
    {
      $match: {
        status: 'Delivered',
        createdAt: { $gte: startOfYear, $lte: endOfYear },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$totalPrice' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const updatedMonths = months.map((month) => {
    const matchingResult = result.find((item) => item._id === month._id);
    if (matchingResult) {
      return { ...month, revenue: matchingResult.revenue };
    }
    return month;
  });

  return res.status(200).json({
    success: true,
    messgae: '',
    data: updatedMonths,
  });
});

const getParameterTotalOfSystemForAdmin = asyncHandler(async (req, res) => {});

const getParameterOfRegionForAdmin = asyncHandler(async (req, res) => {
  let result = await Order.aggregate([
    {
      $match: {
        status: 'Delivered',
      },
    },
    {
      $group: {
        _id: '$province',
        value: { $sum: '$totalPrice' },
      },
    },
    {
      $sort: { value: -1 },
    },
  ]);

  const total = result.reduce((accumulator, item) => {
    return accumulator + item.value;
  }, 0);

  result = result.map((item, index) => {
    return {
      ...item,
      percent: (item.value / total) * 100,
    };
  });

  return res.status(200).json({
    success: true,
    message: 'Get prarameter of region for admin successfully',
    data: result,
  });
});

const getParameterOfCategoryForAdmin = asyncHandler(async (req, res) => {
  let result = await Order.aggregate([
    {
      $match: {
        status: 'Delivered',
      },
    },
    {
      $group: {
        _id: '$categoryId',
        value: { $sum: '$totalPrice' },
      },
    },
    {
      $sort: { value: -1 },
    },
  ]);

  const categoryIds = result.map((item) => item._id);

  const total = result.reduce((accumulator, item) => {
    return accumulator + item.value;
  }, 0);

  const populatedResult = await Promise.all(
    categoryIds.map((categoryId) => Category.findOne({ _id: categoryId }).select('name image')),
  );

  result = result.map((item, index) => {
    const category = populatedResult[index];
    return {
      ...item,
      percent: (item.value / total) * 100,
      category: category,
    };
  });

  return res.status(200).json({
    success: true,
    message: 'Get prarameter of category for admin successfully',
    data: result,
  });
});

const getRevenueLast30DaysForAdmin = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = moment().subtract(30, 'days').startOf('day').toDate();
  const today = moment().endOf('day').toDate();

  const result = await Order.aggregate([
    {
      $match: {
        status: 'Delivered',
        createdAt: { $gte: thirtyDaysAgo, $lte: today },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return res.status(200).json({
    success: true,
    message: 'Get revenue last 7 day status successfully',
    data: result,
  });
});

const getRevenueLast7DaysForAmin = asyncHandler(async (req, res) => {
  const sevenDaysAgo = moment().subtract(7, 'days').startOf('day').toDate();
  const today = moment().endOf('day').toDate();

  const result = await Order.aggregate([
    {
      $match: {
        status: 'Delivered',
        createdAt: { $gte: sevenDaysAgo, $lte: today },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return res.status(200).json({
    success: true,
    message: 'Get revenue last 7 day status successfully',
    data: result,
  });
});

const getRankOfRevenueStoresForAdmin = asyncHandler(async (req, res) => {
  let result = await Order.aggregate([
    {
      $match: {
        status: 'Delivered',
      },
    },
    {
      $group: {
        _id: '$storeId',
        revenue: { $sum: '$totalPrice' },
      },
    },
    {
      $sort: { _id: -1 },
    },
  ]);

  const storeIds = result.map((item) => item._id);

  const populatedResult = await Promise.all(
    storeIds.map((storeId) => Store.findOne({ _id: storeId }).select('name location avatar rating')),
  );

  result = result.map((item, index) => {
    const store = populatedResult[index];
    return {
      ...item,
      store: store,
    };
  });

  return res.status(200).json({
    success: true,
    message: 'Get revenue last 7 day status successfully',
    data: result,
  });
});

const getIndexTotalOfSystemForAdmin = asyncHandler(async (req, res) => {
  const countCustomer = await User.countDocuments({ permissions: { $ne: 'admin' } });
  const countOrder = await Order.countDocuments({});
  const countProduct = await Product.countDocuments({});
  const countStore = await Store.countDocuments({});

  let totalRevenue = await Order.aggregate([
    {
      $match: {
        status: 'Delivered',
      },
    },
    {
      $group: {
        _id: '$province',
        value: { $sum: '$totalPrice' },
      },
    },
  ]);

  totalRevenue = totalRevenue.reduce((accumulator, item) => {
    return accumulator + item.value;
  }, 0);

  return res.status(200).json({
    success: true,
    message: 'Get index total of system for admin successfully',
    data: {
      totalCustomers: countCustomer ? countCustomer : 0,
      totalOrders: countOrder ? countOrder : 0,
      totalProducts: countProduct ? countProduct : 0,
      totalStores: countStore ? countStore : 0,
      totalRevenue: totalRevenue ? totalRevenue : 0,
    },
  });
});

module.exports = {
  getRevenueLast7Days,
  getRevenueLast30Days,
  getRevenueByMonth,
  getTodoList,
  getTotalRevenue,
  getRankProductByRevenue,
  getRankProductByCount,
  getRankCustomer,
  getRevenueMonthsOfYearForAdmin,
  getParameterTotalOfSystemForAdmin,
  getParameterOfRegionForAdmin,
  getParameterOfCategoryForAdmin,
  getRevenueLast30DaysForAdmin,
  getRankOfRevenueStoresForAdmin,
  getIndexTotalOfSystemForAdmin,
  getRevenueLast7DaysForAmin,
};
