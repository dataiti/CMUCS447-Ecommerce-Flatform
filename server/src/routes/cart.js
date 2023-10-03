const express = require('express');
const {
  addCart,
  updateCart,
  removeAllCart,
  removeCart,
  cartById,
  getListCartByUser,
  incrementQuantityCart,
  decrementQuantityCart,
  setQuantityCart,
} = require('../controllers/cart');
const { userById } = require('../controllers/user');

const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/list-carts/:userId', getListCartByUser);
router.post('/add-cart/:userId', addCart);
router.put('/increment-quantity/:userId/:cartId', incrementQuantityCart);
router.put('/decrement-quantity/:userId/:cartId', decrementQuantityCart);
router.put('/set-quantity/:userId/:cartId', setQuantityCart);
router.delete('/remove-all-cart/:userId', removeAllCart);
router.delete('/remove-cart/:userId/:cartId', removeCart);

router.param('userId', userById);
router.param('cartId', cartById);

module.exports = router;
