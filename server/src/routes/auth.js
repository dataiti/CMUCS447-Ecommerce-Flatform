const express = require('express');
const {
  register,
  login,
  loginAmin,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  socialLogin,
  socialLoginUpdateInfo,
  createToken,
} = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/login-admin', loginAmin);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/social-login', socialLogin, socialLoginUpdateInfo, createToken);

module.exports = router;
