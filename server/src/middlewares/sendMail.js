const { generateOTP } = require('../helper/fn');

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const asyncHandler = require('express-async-handler');
dotenv.config();

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});

const sendMailOTP = asyncHandler((email) => {
  const OTP = generateOTP();
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: 'Mã OTP của bạn cho đơn đặt hàng',
    html: `<p>Mã OTP của bạn cho đơn đặt hàng là: <strong>${OTP}</strong></p>`,
  };
  transport.sendMail(mailOptions, (error, infor) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: `Send mail OTP failed: ${error}`,
      });
    }
  });
  return OTP;
});

module.exports = { sendMailOTP };
