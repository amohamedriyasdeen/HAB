const User = require('../models/user.model');

exports.checkRole = (...allowedRoles) => (req, res, next) => {
  const hasRole = req.user?.roles?.some(role => allowedRoles.includes(role));
  if (!hasRole) {
    const error = new Error('Insufficient permissions');
    error.statusCode = 403;
    return next(error);
  }
  next();
};

exports.checkPermission = (resource, action) => async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({ path: 'roles', populate: { path: 'permissions' } })
      .populate('permissions')
      .select('roles permissions');

    const allPermissions = [
      ...user.roles.flatMap(r => r.permissions || []),
      ...(user.permissions || [])
    ];

    if (!allPermissions.some(p => p.resource === resource && p.action === action)) {
      const error = new Error('Insufficient permissions');
      error.statusCode = 403;
      return next(error);
    }

    next();
  } catch (error) {
    next(error);
  }
};
