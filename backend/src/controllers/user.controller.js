const { getUsers, getUserById, updateUserById, updateProfile, updateStatusById, deleteUserById, createUser } = require('../services/user.service');
const { resolveFileUrl } = require('../utils/fileUpload');
const apiResponse = require('../utils/apiResponse');

const withProfileUrl = (user) => {
  if (!user) return user;
  const obj = user.toObject ? user.toObject() : { ...user };
  if (obj.profile) obj.profileUrl = resolveFileUrl(obj.profile);
  return obj;
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await getUsers(req.user.userId);
    return apiResponse.success(res, 'Users fetched successfully', { users: users.map(withProfileUrl) }, 200);
  } catch (err) { next(err); }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    return apiResponse.success(res, 'User fetched successfully', { user: withProfileUrl(user) }, 200);
  } catch (err) { next(err); }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    return apiResponse.success(res, 'User created successfully', { user }, 200);
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await updateUserById(req.params.id, req.body);
    return apiResponse.success(res, 'User updated successfully', { user }, 200);
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await updateProfile(req.user.userId, req.body, req.file);
    return apiResponse.success(res, 'Profile updated successfully', { user: withProfileUrl(user) }, 200);
  } catch (err) { next(err); }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const user = await updateStatusById(req.params.id);
    return apiResponse.success(res, 'User status updated successfully', { user }, 200);
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await deleteUserById(req.params.id);
    return apiResponse.success(res, 'User deleted successfully', null, 200);
  } catch (err) { next(err); }
};
