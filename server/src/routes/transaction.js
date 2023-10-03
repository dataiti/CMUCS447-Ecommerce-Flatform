const express = require('express');
const { getListTransactionForAdmin } = require('../controllers/transaction');
const { userById } = require('../controllers/user');
const uploadCloud = require('../configs/configCloudinary');
const { verifyToken, isAdminSystem } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/list-transactions/admin/:userId', getListTransactionForAdmin);

router.param('userId', userById);

module.exports = router;
