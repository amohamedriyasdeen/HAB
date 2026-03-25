const User = require('../models/user.model');
const Role = require('../models/role.model');
const { uploadFile, deleteFile } = require('../utils/fileUpload');
const { sendMail } = require('../utils/sendMail');
const env = require('../config/appConfig');

const getUsers = async (userId) => {
  const superAdminRole = await Role.findOne({ name: 'super-admin' }).select('_id');
  return User.find({ deletedAt: null, roles: { $ne: superAdminRole?._id }, _id: { $ne: userId } })
    .populate('roles', 'name').select('-password');
};

const getUserById = async (id) => {
  return User.findOne({ _id: id, deletedAt: null }).populate('roles', 'name').select('-password');
};

const createUser = async (body) => {
  const { confirmPassword, ...data } = body;
  const exists = await User.findOne({ email: data.email });
  if (exists) throw Object.assign(new Error('Email already exists'), { statusCode: 409 });
  const user = await User.create({ ...data, mobile: data.mobile || null });
  const result = user.toObject();
  delete result.password;
  return result;
};

const updateUserById = async (id, body) => {
  const { userName, mobile, password } = body;
  const data = { userName, mobile: mobile || null };
  if (password) data.password = password;

  const user = await User.findById(id);
  Object.assign(user, data);
  await user.save();

  const result = await User.findById(id).populate('roles', 'name').select('-password');
  if (password) {
    await sendMail({
      to: user.email,
      subject: 'Your password has been changed',
      template: 'resetPassword',
      variables: { userName: user.userName },
    });
  }
  return result;
};

const updateProfile = async (id, body, file) => {
  const { firstName, lastName, userName, mobile, address, country, state, city, pincode } = body;
  const data = { firstName, lastName, mobile: mobile || null, address, country, state, city, pincode };

  if (userName) {
    const taken = await User.findOne({ userName: userName.toLowerCase(), _id: { $ne: id } });
    if (taken) throw Object.assign(new Error(`Username "${userName}" is already taken`), { statusCode: 409, field: 'userName' });
    data.userName = userName.toLowerCase();
  }

  if (file) {
    const oldUser = await User.findById(id);
    if (oldUser?.profile) await deleteFile(oldUser.profile);
    data.profile = await uploadFile(file, 'uploads/profiles', env.STORAGE_TYPE);
  }

  return User.findByIdAndUpdate(id, data, { new: true }).populate('roles', 'name').select('-password');
};

const updateStatusById = async (id) => {
  const user = await User.findById(id);
  user.isActive = !user.isActive;
  return user.save();
};

const deleteUserById = async (id) => {
  return User.findByIdAndUpdate(id, { deletedAt: new Date(), isActive: false }, { new: true });
};

module.exports = { getUsers, getUserById, createUser, updateUserById, updateProfile, updateStatusById, deleteUserById };
