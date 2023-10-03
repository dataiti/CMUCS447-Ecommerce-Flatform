const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const asyncHandler = require('express-async-handler');

const User = require('../models/user');
const Store = require('../models/store');
const { cleanUserMore, cleanUserLess } = require('../helper/userHandler');

const userById = asyncHandler(async (req, res, next, id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid)
    return res.status(400).json({
      success: true,
      message: 'Id is invalid',
    });

  const user = await User.findById(id);

  if (!user)
    return res.status(400).json({
      success: true,
      message: 'This user is not found',
    });

  req.user = user;
  next();
});

const getUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Get user is successfully',
    data: cleanUserLess(req.user),
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).populate('addressIds');

  return res.status(200).json({
    success: true,
    message: 'Get profile user is successfully',
    data: cleanUserMore(user),
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { username, displayName, email, phone } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { username, displayName, email, phone } },
    { new: true },
  );

  return res.status(200).json({
    success: true,
    message: 'Update profile user is successfully',
    data: cleanUserMore(user),
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  await User.findOneAndDelete({ _id: req.user._id });

  return res.status(200).json({
    success: true,
    message: 'Delete user is successfully',
  });
});

const replacePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) throw new Error('All fields are required');

  if (newPassword !== confirmPassword) throw new Error('New password and confirm password are not match');

  const user = await User.findOne({ _id: req.user._id });

  if (!user.isCorrectPassword) throw new Error('Password is incorrect');

  user.password = newPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    message: 'Replace password is successfully',
    data: cleanUserMore(user),
  });
});

const updateAvatar = asyncHandler(async (req, res) => {
  const oldFilenamePath = req.user.filename;

  const user = await User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    { $set: { avatar: req.file.path, filename: req.file.filename } },
    { new: true },
  );

  if (!user) {
    cloudinary.uploader.destroy(req.file.filename);
    throw new Error('Upload avatar is unsuccessfully');
  }
  if (oldFilenamePath != 'CDIO2-project/dedault_jd3qnu') cloudinary.uploader.destroy(oldFilenamePath);

  return res.status(200).json({
    success: true,
    message: 'Upload avatar is successfully',
    data: cleanUserMore(user),
  });
});

const followStore = asyncHandler(async (req, res) => {
  const oldFollowingStoreIds = req.user.followingStoreIds;
  const followingStoreIds = [...oldFollowingStoreIds, req.store._id];

  const oldFollowerIds = req.store.userFollowIds;

  if (oldFollowingStoreIds.includes(req.store._id)) throw new Error('You are followed this store');

  const userFollowIds = [...oldFollowerIds, req.user._id];

  const user = await User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    { $set: { followingStoreIds } },
    { new: true },
  ).populate('followingStoreIds', 'name');

  const store = await Store.findOneAndUpdate(
    {
      _id: req.store._id,
    },
    { $set: { userFollowIds } },
    { new: true },
  );

  if (!user || !store) throw new Error('Following store is fail');

  return res.status(200).json({
    success: true,
    message: 'Following store is successfully',
    data: user,
  });
});

const unFollowStore = asyncHandler(async (req, res) => {
  const findUser = await User.findOne({ _id: req.user._id });
  const findStore = await Store.findOne({ _id: req.store._id });

  if (findUser.followingStoreIds.includes(req.store._id)) {
    await findUser.updateOne({ $pull: { followingStoreIds: req.store._id } }, { new: false });
  }

  if (findStore.userFollowIds.includes(req.user._id)) {
    await findUser.updateOne({ $pull: { userFollowIds: req.user._id } }, { new: false });
  }

  return res.status(200).json({
    success: true,
    message: 'Following store is successfully',
    data: findUser,
  });
});

const getAllUserForAdmin = asyncHandler(async (req, res) => {
  const status = req.query.status ? req.query.status : '';
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
    $or: [
      { displayName: { $regex: regex, $options: 'i' } },
      { username: { $regex: regex, $options: 'i' } },
      { email: { $regex: regex, $options: 'i' } },
      { phone: { $regex: regex, $options: 'i' } },
    ],
    permissions: { $ne: 'admin' },
  };

  if (status) filterArgs.status = status;

  const countUser = await User.countDocuments(filterArgs);

  if (!countUser) throw new Error('List users are not found');

  const totalPage = Math.ceil(countUser / limit);

  if (page > totalPage) skip = (totalPage - 1) * limit;

  const users = await User.find(filterArgs)
    .sort({ [sortBy]: orderBy, _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate('addressIds');

  if (users) {
    users.forEach((user) => {
      user = cleanUserMore(user);
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Get list users are successfully',
    totalPage,
    currentPage: page,
    count: countUser,
    data: users,
  });
});

module.exports = {
  userById,
  getUser,
  getProfile,
  updateProfile,
  deleteUser,
  replacePassword,
  updateAvatar,
  followStore,
  unFollowStore,
  getAllUserForAdmin,
};
