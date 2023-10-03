const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Address = require('../models/address');
const User = require('../models/user');

const addressById = asyncHandler(async (req, res, next, id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) {
    return res.status(400).json({
      success: true,
      message: 'Id is invalid',
    });
  }

  const address = await Address.findById(id);

  if (!address)
    return res.status(400).json({
      success: true,
      message: 'This address is not found',
    });

  req.address = address;
  next();
});

const getListAdressesByUser = asyncHandler(async (req, res) => {
  const addresses = await Address.find({
    userId: req.user._id,
  });

  if (!addresses) throw new Error('List addresses are not found');

  return res.status(200).json({
    success: true,
    message: 'Get list addresses are successfully',
    data: addresses,
  });
});

const addAddress = asyncHandler(async (req, res) => {
  const { province, district, ward, exactAddress, phone, displayName } = req.body;

  if (!province || !district || !ward || !exactAddress || !phone || !displayName)
    throw new Error('All fields are required');

  const newAddress = new Address({
    userId: req.user._id,
    phone,
    displayName,
    province,
    ward,
    district,
    exactAddress,
  });
  await newAddress.save();

  const addresses = req.user.addressIds;

  const addressesFinal = [...addresses, newAddress._id];

  const findUser = await User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    { $set: { addressIds: addressesFinal } },
    { new: true },
  );

  return res.status(200).json({
    success: true,
    message: 'Add address is successfully',
    data: newAddress,
  });
});

const updateAddress = asyncHandler(async (req, res) => {
  const { province, district, ward, exactAddress, phone, displayName } = req.body;

  const address = await Address.findOneAndUpdate(
    { _id: req.address._id },
    { $set: { province, district, exactAddress, ward, phone, displayName } },
    { new: true },
  );

  return res.status(200).json({
    success: true,
    message: 'Update address is successfully',
    data: address,
  });
});

const removeAddress = asyncHandler(async (req, res) => {
  await Address.findOneAndDelete({ _id: req.address._id });

  return res.status(200).json({
    success: true,
    message: 'Delete address is successfully',
  });
});

const setupDefaultAddress = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ userId: req.user._id, isDefaultAddress: true, _id: { $ne: req.address._id } });

  addresses.forEach(async (address) => {
    address.isDefaultAddress = false;
    await address.save();
  });

  const addressUpdate = await Address.findOneAndUpdate(
    { _id: req.address._id, userId: req.user._id },
    { $set: { isDefaultAddress: true } },
    { new: true },
  );

  return res.status(200).json({
    success: true,
    message: 'Setup default address is successfully',
    data: addressUpdate,
  });
});

const getAddressDefault = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ userId: req.user._id, isDefaultAddress: true });

  if (!address) throw new Error('Address is not found');

  return res.status(200).json({
    success: true,
    message: 'Setup default address is successfully',
    data: address,
  });
});

module.exports = {
  addressById,
  getListAdressesByUser,
  addAddress,
  updateAddress,
  removeAddress,
  setupDefaultAddress,
  getAddressDefault,
};
