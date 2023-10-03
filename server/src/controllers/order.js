const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const moment = require('moment');
const Order = require('../models/order');
const Transaction = require('../models/transaction');
const { sendMailOTP } = require('../middlewares/sendMail');

const orderById = asyncHandler(async (req, res, next, id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid)
    return res.status(400).json({
      success: true,
      message: 'Id is invalid',
    });

  const order = await Order.findById(id);

  if (!order)
    return res.status(400).json({
      success: true,
      message: 'This order is not found',
    });

  req.order = order;
  next();
});

const getDetailOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.order._id })
    .populate('userId', 'displayName avatar email')
    .populate('storeId', 'name')
    .populate('deliveryId', 'name logo')
    .populate('shippingAddressId', '')
    .populate('productId', 'name imagePreview');

  if (!order) throw new Error('Order is not found');

  return res.status(200).json({
    success: true,
    message: 'Get order detail is successfully',
    data: order,
  });
});

const createOrder = asyncHandler(async (req, res) => {
  const { carts } = req.body;

  if (!carts) throw new Error('Cart is required');

  const cartsParse = JSON.parse(carts);

  const orders = cartsParse.forEach(async (cart, index) => {
    let orderId = [];
    if (
      !cart.deliveryId ||
      !cart.shippingAddressId ||
      !cart.paymentMethod ||
      !cart.shippingPrice ||
      !cart.productId ||
      !cart.optionStyle ||
      !cart.quantity ||
      !cart.totalPrice
    ) {
      throw new Error(`All fields in order ${index + 1} are required`);
    }
    const newOrder = new Order({
      userId: req.user._id,
      storeId: cart.storeId,
      deliveryId: cart.deliveryId,
      shippingAddressId: cart.shippingAddressId,
      paymentMethod: cart.paymentMethod,
      shippingPrice: cart.shippingPrice,
      productId: cart.productId,
      province: cart.province,
      categoryId: cart.categoryId,
      optionStyle: cart.optionStyle,
      quantity: cart.quantity,
      totalPrice: cart.totalPrice,
      isPaid: cart.paymentMethod === 'COD' ? false : true,
    });

    await newOrder.save();

    orderId.push(newOrder._id);

    if (cart.paymentMethod === 'PayPal' && newOrder) {
      const newTransaction = new Transaction({
        payerId: req.user._id,
        receiverId: cart.storeId,
        amount: Number(cart.totalPrice),
        transactionMethod: cart.paymentMethod,
      });

      await newTransaction.save();
    }

    return orderId;
  });

  return res.status(200).json({
    success: true,
    message: 'Create order is successfully',
    data: orders,
  });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.order._id, userId: req.user._id });

  if (!order) throw new Error('Order not found');

  const currentStatus = order.status;

  console.log('currentStatus', currentStatus);

  if (currentStatus === 'Shipping') throw new Error('This order already shipping');
  else if (currentStatus === 'Delivered') throw new Error('This order already completed');
  else if (currentStatus === 'Cancelled') throw new Error('This order already cancelled');

  await Order.findOneAndUpdate({ _id: order._id }, { $set: { status: 'Cancelled' } }, { new: true });

  return res.status(200).json({
    success: true,
    message: 'Cancelled order successfully',
  });
});

const updateStatusOrderByStore = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const currentStatus = req.store.status;

  if (currentStatus === 'Cancelled') throw new Error('This order already cancelled');

  if (!['Waiting Confirm', 'Preparing Goods', 'Shipping', 'Delivered', 'Cancelled'].includes(status))
    throw new Error('Status is invalid');

  const order = await Order.findOne({ _id: req.order._id, storeId: req.store._id });

  if (!order) throw new Error('Order not found');

  const updateOrder = await Order.findOneAndUpdate({ _id: order._id }, { $set: { status: status } }, { new: true })
    .populate('userId', 'displayName')
    .populate('storeId', 'name')
    .populate('deliveryId', 'name')
    .populate('shippingAddressId', '')
    .populate('productId', 'name imagePreview');

  return res.status(200).json({
    success: true,
    message: 'Update order status successfully',
    data: updateOrder,
  });
});

const getOrderStatusByUSer = asyncHandler(async (req, res) => {
  const { status } = req.query;

  // if (!['Waiting Confirm', 'Preparing Goods', 'Shipping', 'Delivered', 'Cancelled'].includes(status))
  //   throw new Error('Status is invalid');

  const search = req.query.q ? req.query.q : '';
  const regex = search
    .split(' ')
    .filter((q) => q)
    .join('|');
  const sortBy = req.query.sortBy ? req.query.sortBy : '-_id';
  const orderBy =
    req.query.orderBy && (req.query.orderBy == 'asc' || req.query.orderBy == 'desc') ? req.query.orderBy : 'asc';
  const limit = req.query.limit && req.query.limit > 0 ? Number(req.query.limit) : 6;
  const page = req.query.page && req.query.page > 0 ? Number(req.query.page) : 1;
  let skip = (page - 1) * limit;

  const filterArgs = {
    userId: req.user._id,
  };

  if (status) filterArgs.status = status;

  const countOrders = await Order.countDocuments(filterArgs);

  if (!countOrders) throw new Error('List order are not found');

  const totalPage = Math.ceil(countOrders / limit);

  if (page > totalPage) skip = (totalPage - 1) * limit;

  const orders = await Order.find(filterArgs)
    .sort({ [sortBy]: orderBy, _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'displayName')
    .populate('storeId', 'name')
    .populate('deliveryId', 'name')
    .populate('shippingAddressId', '')
    .populate('productId', 'name imagePreview');

  return res.status(200).json({
    success: true,
    message: 'Get list order are successfully',
    totalPage,
    currentPage: page,
    count: countOrders,
    data: orders,
  });
});

const getOrderStatusByStore = asyncHandler(async (req, res) => {
  const { status } = req.query;

  // if (!['Waiting Confirm', 'Preparing Goods', 'Shipping', 'Delivered', 'Cancelled'].includes(status))
  //   throw new Error('Status is invalid');

  const search = req.query.q ? req.query.q : '';
  const regex = search
    .split(' ')
    .filter((q) => q)
    .join('|');
  const sortBy = req.query.sortBy ? req.query.sortBy : '-_id';
  const orderBy =
    req.query.orderBy && (req.query.orderBy == 'asc' || req.query.orderBy == 'desc') ? req.query.orderBy : 'asc';
  const limit = req.query.limit && req.query.limit > 0 ? Number(req.query.limit) : 6;
  const page = req.query.page && req.query.page > 0 ? Number(req.query.page) : 1;
  let skip = (page - 1) * limit;

  const filterArgs = {
    storeId: req.store._id,
  };

  if (status) filterArgs.status = status;

  const countOrders = await Order.countDocuments(filterArgs);

  if (!countOrders) throw new Error('List order are not found');

  const totalPage = Math.ceil(countOrders / limit);

  if (page > totalPage) skip = (totalPage - 1) * limit;

  const orders = await Order.find(filterArgs)
    .sort({ [sortBy]: orderBy, _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'displayName email avatar')
    .populate('storeId', 'name avatar')
    .populate('deliveryId', 'name logo')
    .populate('shippingAddressId', '')
    .populate('productId', 'name imagePreview');

  return res.status(200).json({
    success: true,
    message: 'Get list order are successfully',
    totalPage,
    currentPage: page,
    count: countOrders,
    data: orders,
  });
});

const getOrderStatusForAdmin = asyncHandler(async (req, res) => {
  const { status } = req.query;

  // if (!['Waiting Confirm', 'Preparing Goods', 'Shipping', 'Delivered', 'Cancelled'].includes(status))
  //   throw new Error('Status is invalid');

  const search = req.query.q ? req.query.q : '';
  const regex = search
    .split(' ')
    .filter((q) => q)
    .join('|');
  const sortBy = req.query.sortBy ? req.query.sortBy : '-_id';
  const orderBy =
    req.query.orderBy && (req.query.orderBy == 'asc' || req.query.orderBy == 'desc') ? req.query.orderBy : 'asc';
  const limit = req.query.limit && req.query.limit > 0 ? Number(req.query.limit) : 6;
  const page = req.query.page && req.query.page > 0 ? Number(req.query.page) : 1;
  let skip = (page - 1) * limit;

  const filterArgs = {};

  if (status) filterArgs.status = status;

  const countOrders = await Order.countDocuments(filterArgs);

  if (!countOrders) throw new Error('List order are not found');

  const totalPage = Math.ceil(countOrders / limit);

  if (page > totalPage) skip = (totalPage - 1) * limit;

  const orders = await Order.find(filterArgs)
    .sort({ [sortBy]: orderBy, _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'displayName email avatar')
    .populate('storeId', 'name avatar')
    .populate('deliveryId', 'name logo')
    .populate('shippingAddressId', '')
    .populate('productId', 'name imagePreview');

  return res.status(200).json({
    success: true,
    message: 'Get list order are successfully',
    totalPage,
    currentPage: page,
    count: countOrders,
    data: orders,
  });
});

module.exports = {
  orderById,
  createOrder,
  getDetailOrder,
  updateStatusOrderByStore,
  cancelOrder,
  getOrderStatusByStore,
  getOrderStatusByUSer,
  getOrderStatusForAdmin,
};
