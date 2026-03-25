const { registerUser, loginUser, refreshAccessToken, logoutUser, forgotPasswordService, resetPasswordService, verifyResetTokenService } = require('../services/auth.service');
const { handleOAuthUser } = require('../services/oauth.service');
const env = require('../config/appConfig');
const {setCookies, clearCookies, setAuthFlagCookie, clearAuthFlagCookie} = require('../utils/cookies');
const apiResponse = require('../utils/apiResponse');
const { verifyToken } = require('../utils/token');
const RefreshToken = require('../models/refreshToken.model');
const User = require('../models/user.model');
const { resolveFileUrl } = require('../utils/fileUpload');

exports.login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body, req);
    setCookies(res, 'accessToken', accessToken, env.NODE_ENV, 15 * 60 * 1000);
    setCookies(res, 'refreshToken', refreshToken, env.NODE_ENV, 7 * 24 * 60 * 60 * 1000);
    setAuthFlagCookie(res, env.NODE_ENV);
    return apiResponse.success(res, "Login successful", { 
      user: {
        id: user._id,
        email: user.email,
        userName: user.userName,
        roles: user.roles
      }
    }, 200);
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await registerUser(req.body, req);
    setCookies(res, 'accessToken', accessToken, env.NODE_ENV, 15 * 60 * 1000);
    setCookies(res, 'refreshToken', refreshToken, env.NODE_ENV, 7 * 24 * 60 * 60 * 1000);
    setAuthFlagCookie(res, env.NODE_ENV);
    return apiResponse.success(res, "Registration successful", { 
      user: {
        id: user._id,
        email: user.email,
        userName: user.userName,
        roles: user.roles
      }
    }, 201);
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      const error = new Error('Refresh token not found');
      error.statusCode = 401;
      throw error;
    }
    
    const { accessToken } = await refreshAccessToken(refreshToken);
    setCookies(res, 'accessToken', accessToken, env.NODE_ENV, 15 * 60 * 1000);
    
    return apiResponse.success(res, 'Token refreshed successfully', { accessToken }, 200);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const userId = req.user?.userId;

    if (userId) {
      await logoutUser(userId, refreshToken);
    } else if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    clearCookies(res, 'accessToken', env.NODE_ENV);
    clearCookies(res, 'refreshToken', env.NODE_ENV);
    clearAuthFlagCookie(res, env.NODE_ENV);

    return apiResponse.success(res, 'Logged out successfully', {}, 200);
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('roles', 'name')
      .select('-password');
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    if (!user.isActive) {
      const error = new Error('User account is inactive');
      error.statusCode = 403;
      throw error;
    }
    
    return apiResponse.success(res, 'User data retrieved successfully', {
      user: {
        id: user._id,
        email: user.email,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        address: user.address,
        country: user.country,
        state: user.state,
        city: user.city,
        pincode: user.pincode,
        roles: user.roles,
        isActive: user.isActive,
        emailVerifiedAt: user.emailVerifiedAt,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        profile: user.profile,
        profileUrl: user.profile ? resolveFileUrl(user.profile) : null,
      }
    }, 200);
  } catch (error) {
    next(error);
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      return apiResponse.success(res, 'No tokens found', { user: null, requiresRefresh: false }, 200);
    }

    const decoded = verifyToken(accessToken, env.JWT_SECRET);

    if (!decoded) {
      if (!refreshToken) {
        return apiResponse.success(res, 'No valid tokens found', { user: null, requiresRefresh: false }, 200);
      }

      const refreshDecoded = verifyToken(refreshToken, env.JWT_REFRESH_SECRET);
      if (!refreshDecoded) {
        return apiResponse.success(res, 'Tokens expired', { user: null, requiresRefresh: false }, 200);
      }

      const storedToken = await RefreshToken.findOne({ token: refreshToken });
      if (!storedToken || storedToken.expiresAt < new Date()) {
        return apiResponse.success(res, 'Tokens expired', { user: null, requiresRefresh: false }, 200);
      }

      return apiResponse.success(res, 'Access token expired, refresh required', { requiresRefresh: true }, 200);
    }

    const user = await User.findById(decoded.userId).populate('roles', 'name').select('-password');

    if (!user) {
      return apiResponse.success(res, 'User not found', { user: null, requiresRefresh: false }, 200);
    }

    return apiResponse.success(res, 'Token is valid', {
      user: {
        id: user._id,
        email: user.email,
        userName: user.userName,
        roles: user.roles,
        isActive: user.isActive,
        profile: user.profile,
        profileUrl: user.profile ? resolveFileUrl(user.profile) : null
      },
      requiresRefresh: false
    }, 200);
  } catch (error) {
    next(error);
  }
};

exports.oauthCallback = async (req, res) => {
  try {
    const { provider, profile } = req.user;
    const { accessToken, refreshToken } = await handleOAuthUser(provider, profile, req);
    setCookies(res, 'accessToken', accessToken, env.NODE_ENV, 15 * 60 * 1000);
    setCookies(res, 'refreshToken', refreshToken, env.NODE_ENV, 7 * 24 * 60 * 60 * 1000);
    setAuthFlagCookie(res, env.NODE_ENV);
    res.redirect(`${env.FRONTEND_URL}/#/oauth/success`);
  } catch (error) {
    res.redirect(`${env.FRONTEND_URL}/#/oauth/error?message=${encodeURIComponent(error.message)}`);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await forgotPasswordService(email);
    return apiResponse.success(res, 'If an account with that email exists, a password reset link has been sent', {}, 200);
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    await resetPasswordService(token, password);
    return apiResponse.success(res, 'Password reset successful', {}, 200);
  } catch (error) {
    next(error);
  }
};

exports.verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    await verifyResetTokenService(token);
    return apiResponse.success(res, 'Token is valid', {}, 200);
  } catch (error) {
    next(error);
  }
};