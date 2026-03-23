const { getUsers, getUserById, updateUserById, updateStatusById, deleteUserById, createUser } = require('../services/user.service');
const { resolveFileUrl } = require('../utils/imageUpload');
const apiResponse = require('../utils/apiResponse');

const resolveProfileUrl = (user) => {
  if (!user) return user;
  const obj = user.toObject ? user.toObject() : { ...user };
  if (obj.profile) obj.profileUrl = resolveFileUrl(obj.profile, obj.profileStorageType || 's3');
  return obj;
};

exports.getUsers = async (req, res, next) => {
  try {
    // console.log(req.user?.authId);
    const users = await getUsers(req.user.userId);
    return apiResponse.success(res, "Users fetched successfully", { users: users.map(resolveProfileUrl) }, 200);
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    return apiResponse.success(res, "User fetched successfully", { user: resolveProfileUrl(user) }, 200);
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    return apiResponse.success(res, "User Created successfully", { user }, 200);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await updateUserById(req.params.id, req.body);
    return apiResponse.success(res, "User updated successfully", { user }, 200);
  } catch (error) {
    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const user = await updateStatusById(req.params.id);
    return apiResponse.success(res, "User status updated successfully", { user }, 200);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await deleteUserById(req.params.id);
    return apiResponse.success(res, "User deleted successfully", null, 200);
  } catch (error) {
    next(error);
  }
};