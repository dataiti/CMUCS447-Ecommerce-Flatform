const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const moment = require('moment');
const Transaction = require('../models/transaction');

const transactionById = asyncHandler(async (req, res, next, id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid)
    return res.status(400).json({
      success: true,
      message: 'Id is invalid',
    });

  const transaction = await Transaction.findById(id);

  if (!transaction)
    return res.status(400).json({
      success: true,
      message: 'This transaction is not found',
    });

  req.transaction = transaction;
  next();
});

const getTransaction = asyncHandler(async (req, res) => {});

const createTransaction = asyncHandler(async (req, res) => {});

const getListTransactionForAdmin = asyncHandler(async (req, res) => {
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

  const countTransactions = await Transaction.countDocuments(filterArgs);

  if (!countTransactions) throw new Error('List order are not found');

  const totalPage = Math.ceil(countTransactions / limit);

  if (page > totalPage) skip = (totalPage - 1) * limit;

  const transactions = await Transaction.find(filterArgs)
    .sort({ [sortBy]: orderBy, _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate('payerId', 'displayName email avatar phone')
    .populate('receiverId', 'name ownerId location avatar rating');

  return res.status(200).json({
    success: true,
    message: 'Get list transactions are successfully',
    totalPage,
    currentPage: page,
    count: countTransactions,
    data: transactions,
  });
});

module.exports = { transactionById, createTransaction, getTransaction, getListTransactionForAdmin };
