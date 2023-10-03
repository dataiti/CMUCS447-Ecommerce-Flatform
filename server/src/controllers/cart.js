const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Cart = require('../models/cart');
const _ = require('lodash');

const cartById = asyncHandler(async (req, res, next, id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid)
    return res.status(400).json({
      success: true,
      message: 'Id is invalid',
    });

  const cart = await Cart.findById(id);

  if (!cart)
    return res.status(400).json({
      success: true,
      message: 'This cart is not found',
    });

  req.cart = cart;
  next();
});

const addCart = asyncHandler(async (req, res) => {
  const { optionStyle, productId, storeId, quantity, price } = req.body;

  if (!productId || !storeId || !quantity || !price) throw new Error('All fields are required');

  const optionStyleParse = optionStyle ? JSON.parse(optionStyle) : {};

  const cart = await Cart.findOne({ userId: req.user._id });

  if (cart) {
    const carts = await Cart.find({ productId, storeId });
    const cartItem = _.find(carts, (obj) => _.isEqual(obj.optionStyle, optionStyleParse));

    if (carts && cartItem) {
      cartItem.quantity += Number(quantity);
      await cartItem.save();

      const infoCart = await Cart.findOne({ _id: cartItem._id })
        .populate({
          path: 'storeId',
          select: {
            name: 1,
            avatar: 1,
            isActive: 1,
            isOpen: 1,
          },
        })
        .populate({
          path: 'productId',
          select: {
            name: 1,
            imagePreview: 1,
            sold: 1,
          },
        });

      return res.status(200).json({
        success: true,
        message: 'Add product to cart is successfully',
        data: infoCart,
      });
    } else {
      const newCart = new Cart({
        userId: req.user._id,
        productId,
        storeId,
        optionStyle: optionStyleParse,
        quantity: Number(quantity),
        price: Number(price),
      });
      await newCart.save();

      const infoCart = await Cart.findOne({ _id: newCart._id })
        .populate({
          path: 'storeId',
          select: {
            name: 1,
            avatar: 1,
            isActive: 1,
            isOpen: 1,
          },
        })
        .populate({
          path: 'productId',
          select: {
            name: 1,
            imagePreview: 1,
            sold: 1,
          },
        });

      return res.status(200).json({
        success: true,
        message: 'Add product to cart is successfully',
        data: infoCart,
      });
    }
  } else {
    const newCart = new Cart({
      userId: req.user._id,
      storeId,
      productId,
      optionStyle: optionStyleParse,
      quantity: Number(quantity),
      price: Number(price),
    });
    await newCart.save();

    const infoCart = await Cart.findOne({ _id: newCart._id })
      .populate({
        path: 'storeId',
        select: {
          name: 1,
          avatar: 1,
          isActive: 1,
          isOpen: 1,
        },
      })
      .populate({
        path: 'productId',
        select: {
          name: 1,
          imagePreview: 1,
          sold: 1,
        },
      });

    return res.status(200).json({
      success: true,
      message: 'Add product to cart is successfully',
      data: infoCart,
    });
  }
});

const updateCart = asyncHandler(async (req, res) => {});

const incrementQuantityCart = asyncHandler(async (req, res) => {
  const newQuantity = req.cart.quantity + 1;

  const cart = await Cart.findOneAndUpdate(
    {
      userId: req.user._id,
      _id: req.params.cartId,
    },
    { $set: { quantity: newQuantity } },
    { new: true },
  )
    .populate({
      path: 'storeId',
      select: {
        name: 1,
        avatar: 1,
        isActive: 1,
        isOpen: 1,
      },
    })
    .populate({
      path: 'productId',
      select: {
        name: 1,
        imagePreview: 1,
        categoryId: 1,
        sold: 1,
      },
    });

  if (!cart) throw new Error('Cart is not found');

  return res.status(200).json({
    success: true,
    message: 'Increment quantity cart successfully',
    data: cart,
  });
});

const decrementQuantityCart = asyncHandler(async (req, res) => {
  const newQuantity = req.cart.quantity - 1;

  const cart = await Cart.findOneAndUpdate(
    {
      userId: req.user._id,
      _id: req.params.cartId,
    },
    { $set: { quantity: newQuantity } },
    { new: true },
  )
    .populate({
      path: 'storeId',
      select: {
        name: 1,
        avatar: 1,
        isActive: 1,
        isOpen: 1,
      },
    })
    .populate({
      path: 'productId',
      select: {
        name: 1,
        imagePreview: 1,
        categoryId: 1,
        sold: 1,
      },
    });

  if (!cart) throw new Error('Cart is not found');

  return res.status(200).json({
    success: true,
    message: 'Decrement quantity cart successfully',
    data: cart,
  });
});

const setQuantityCart = asyncHandler(async (req, res) => {
  const newQuantity = req.body.newQuantity;

  const cart = await Cart.findOneAndUpdate(
    {
      userId: req.user._id,
      _id: req.params.cartId,
    },
    {
      $set: { quantity: newQuantity },
    },
    { new: true },
  );

  if (!cart) throw new Error('Cart is not found');

  return res.status(200).json({
    success: true,
    message: 'Set quantity cart is successfully',
    data: cart,
  });
});

const removeAllCart = asyncHandler(async (req, res) => {
  const cart = await Cart.find({ userId: req.user._id });

  if (!cart) throw new Error('Cart not found');
  return res.status(200).json({
    success: true,
    message: 'Remove cart is successfully',
  });
});

const removeCart = asyncHandler(async (req, res) => {
  const deletecart = await Cart.findOneAndDelete({ userId: req.user._id, _id: req.cart._id });

  if (!deletecart) throw new Error('Cart not found');

  return res.status(200).json({
    success: true,
    message: 'Remove cart is successfully',
  });
});

const getListCartByUser = asyncHandler(async (req, res) => {
  const carts = await Cart.find({ userId: req.user._id })
    .sort({ _id: -1 })
    .populate({
      path: 'storeId',
      select: {
        name: 1,
        avatar: 1,
        isActive: 1,
        isOpen: 1,
      },
    })
    .populate({
      path: 'productId',
      select: {
        name: 1,
        imagePreview: 1,
        categoryId: 1,
        sold: 1,
      },
    });

  return res.status(200).json({
    success: true,
    message: 'Get cart by user sucessfully',
    data: carts,
  });
});

module.exports = {
  addCart,
  updateCart,
  removeAllCart,
  removeCart,
  cartById,
  getListCartByUser,
  incrementQuantityCart,
  decrementQuantityCart,
  setQuantityCart,
};
