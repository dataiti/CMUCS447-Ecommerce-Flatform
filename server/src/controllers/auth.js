const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const JWT = require('jsonwebtoken');
const { cleanUserMore } = require('../helper/userHandler');

const generateAccessToken = (_id, permissions) => {
  return JWT.sign({ _id, permissions }, process.env.JWT_SECRET_ACCESS_KEY, { expiresIn: '1d' });
};

const generateRefreshToken = (_id, permissions) => {
  return JWT.sign({ _id, permissions }, process.env.JWT_SECRET_REFRESH_KEY, { expiresIn: '30d' });
};

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) throw new Error('All fields are required');

  const user = await User.findOne({ email });

  if (user) throw new Error('This email already exists');

  const newUser = new User(req.body);

  await newUser.save();

  const accessToken = generateAccessToken(newUser._id, newUser.permissions);
  const newRefreshToken = generateRefreshToken(newUser._id, newUser.permissions);

  return res.status(200).json({
    success: true,
    message: 'Register is successfully',
    accessToken,
    refreshToken: newRefreshToken,
    data: cleanUserMore(newUser),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new Error('All fields are required');

  const user = await User.findOne({ email });

  if (!user) throw new Error('This user is not found');

  if (!(await user.isCorrectPassword(password))) throw new Error('Password is incorrect');

  const accessToken = generateAccessToken(user._id, user.permissions);
  const newRefreshToken = generateRefreshToken(user._id, user.permissions);

  await User.findOneAndUpdate(
    {
      _id: user._id,
    },
    { $set: { refreshToken: newRefreshToken } },
    { new: true },
  );

  return (
    res
      // .cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json({
        success: true,
        accessToken,
        refreshToken: newRefreshToken,
        data: cleanUserMore(user),
      })
  );
});

const loginAmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new Error('All fields are required');

  const user = await User.findOne({ email });

  if (!user) throw new Error('This user is not found');

  if (user.permissions !== 'admin') throw new Error('You are not admin of the system');

  if (!(await user.isCorrectPassword(password))) throw new Error('Password is incorrect');

  const accessToken = generateAccessToken(user._id, user.permissions);
  const newRefreshToken = generateRefreshToken(user._id, user.permissions);

  await User.findOneAndUpdate(
    {
      _id: user._id,
    },
    { $set: { refreshToken: newRefreshToken } },
    { new: true },
  );

  return (
    res
      // .cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json({
        success: true,
        accessToken,
        refreshToken: newRefreshToken,
        data: cleanUserMore(user),
      })
  );
});

const logout = asyncHandler(async (req, res) => {
  // const cookie = req.cookies;

  // if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies');

  const { refreshToken } = req.body;

  if (!refreshToken) throw new Error('No refresh token in request body');

  await User.findOneAndUpdate(
    {
      refreshToken: cookie.refreshToken,
    },
    { $set: { refreshToken: '' } },
    { new: true },
  );

  return (
    res
      // .clearCookie('refreshToken', { httpOnly: true, secure: true })
      .status(200)
      .json({
        success: true,
        message: 'Logout successfully',
      })
  );
});

const refreshToken = asyncHandler(async (req, res) => {
  // const cookie = req.cookies;

  // if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies');

  const { refreshToken } = req.body;

  if (!refreshToken) throw new Error('No refresh token in request body');

  const decoded = JWT.verify(cookie.refreshToken, process.env.JWT_SECRET_REFRESH_KEY);

  const user = await User.findOne({
    _id: decoded._id,
    refreshToken: cookie.refreshToken,
  });

  const newAccessToken = generateAccessToken(user._id);

  return res.status(200).json({
    success: true,
    message: 'Get refresh token is successfully',
    accessToken: newAccessToken,
  });
});

const socialLogin = asyncHandler(async (req, res, next) => {
  const { facebookId, googleId } = req.body;

  // if (!facebookId || !googleId) throw new Error('googleId or facebookId field must be required');

  const user = await User.findOne({
    $or: [
      {
        googleId: {
          $exists: true,
          $ne: null,
          $eq: googleId,
        },
        facebookId: {
          $exists: true,
          $ne: null,
          $eq: facebookId,
        },
      },
    ],
  });

  if (!user) {
    next();
  } else {
    req.auth = user;
    next();
  }
});

const socialLoginUpdateInfo = asyncHandler(async (req, res, next) => {
  if (req.auth) {
    next();
  } else {
    const { displayName, email, avatar, googleId, facebookId } = req.body;

    if (googleId) {
      const user = await User.findOneAndUpdate(
        {
          email,
        },
        { $set: { googleId } },
        { new: true },
      );

      if (!user) {
        const newUser = new User({
          displayName,
          email,
          avatar,
          googleId,
          facebookId,
        });

        await newUser.save();
        req.auth = newUser;
        next();
      } else {
        req.auth = user;
        next();
      }
    }

    if (facebookId) {
      const user = await User.findOneAndUpdate(
        {
          email,
        },
        { $set: { facebookId } },
        { new: true },
      );

      if (!user) {
        const newUser = new User({
          displayName,
          email,
          avatar,
          googleId,
          facebookId,
        });

        await newUser.save();
        req.auth = newUser;
        next();
      } else {
        req.auth = user;
        next();
      }
    }
  }
});

const createToken = asyncHandler(async (req, res) => {
  const user = req.auth;

  const accessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  await User.findOneAndUpdate(
    {
      _id: user._id,
    },
    { $set: { refreshToken: newRefreshToken } },
    { new: true },
  );

  return (
    res
      // .cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json({
        success: true,
        accessToken,
        refreshToken: newRefreshToken,
        data: cleanUserMore(user),
      })
  );
});

// passport.use(
//   {
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: 'http://localhost:3000/auth/facebook/callback',
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       const existingUser = await User.findOne({ facebookId: profile.id });

//       if (existingUser) {
//         done(null, existingUser);
//       } else {
//         const newUser = new User({
//           facebookId: profile.id,
//           displayName: profile.displayName,
//           avatar: profile.avatar,
//           email: profile.emails[0].name,
//         });

//         await newUser.save();
//         done(null, newUser);
//       }
//     } catch (error) {
//       done(error, null);
//     }
//   },
// );

const forgotPassword = asyncHandler(async (req, res) => {});

const resetPassword = asyncHandler(async (req, res) => {});

module.exports = {
  register,
  login,
  logout,
  loginAmin,
  refreshToken,
  forgotPassword,
  resetPassword,
  socialLogin,
  socialLoginUpdateInfo,
  createToken,
};
