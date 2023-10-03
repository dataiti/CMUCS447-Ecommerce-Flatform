const express = require('express');
const { sendMailOTPToClient } = require('../controllers/mail');
const { sendMailOTP } = require('../middlewares/sendMail');

const router = express.Router();

router.post('/send-otp-order', sendMailOTPToClient);

module.exports = router;
