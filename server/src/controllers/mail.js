const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { sendMailOTP } = require('../middlewares/sendMail');

const sendMailOTPToClient = asyncHandler(async (req, res) => {
  if (!req.body.email) throw new Error('Email field is required');

  const OTP = await sendMailOTP(req.body.email);

  if (!OTP) {
    throw new Error('Send mail is failed');
  }

  return res.status(200).json({
    success: true,
    message: 'Send mail OTP is successfully',
    data: OTP,
  });
});

module.exports = { sendMailOTPToClient };
