const { verifyToken } = require("../utils/token");
const env = require('../config/appConfig');
const User = require('../models/user.model');

exports.authCheck = async (req, res, next) => {
  const isCookie = env?.AUTH_BASE === 'cookie';
  const header = req.headers.authorization || '';
  const [scheme, tokenFromHeader] = header.split(' ');
  const token = isCookie
    ? req.cookies?.accessToken
    : (scheme === 'Bearer' && tokenFromHeader ? tokenFromHeader : null);
  
  if (!token) {
    const error = new Error('Authorization token missing');
    error.statusCode = 401;
    return next(error);
  }
  
  const decoded = verifyToken(token, env.JWT_SECRET);
  if (!decoded) {
    const error = new Error('Invalid or expired token');
    error.statusCode = 401;
    return next(error);
  }

  const user = await User.findOne({ _id: decoded.userId, isActive: true, deletedAt: null })
    .populate('roles', 'name')
    .select('_id roles');
  if (!user) {
    const error = new Error('Account is inactive or deleted');
    error.statusCode = 403;
    return next(error);
  }
  req.user = { userId: decoded.userId, roles: user.roles.map(r => r.name) };
  next();
};