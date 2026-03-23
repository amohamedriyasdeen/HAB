const User = require("../models/user.model");
const Role = require('../models/role.model');
const { uploadFile, deleteFile, resolveFileUrl } = require('../utils/imageUpload');
const { sendMail } = require('../utils/sendMail');

const getUsers = async (userId) => {
  const superAdminRole = await Role.findOne({ name: 'super-admin' }).select('_id');
  const users = await User.find({ deletedAt: null, roles: { $ne: superAdminRole?._id }, _id: { $ne: userId } })
    .populate('roles', 'name')
    .select('-password');
  return users;
};

const getUserById = async (id) => {
  const user = await User.findOne({ _id: id, deletedAt: null })
    .populate('roles', 'name')
    .select('-password');
  return user;
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
  const { userName, mobile, password, confirmPassword } = body;

  const data = { userName, mobile: mobile || null };
  if (password) data.password = password;

  const user = await User.findById(id);
  Object.assign(user, data);
  await user.save();

  const result = await User.findById(id).populate('roles', 'name').select('-password');

  if (password && result) {
    await sendMail({
      to: user.email,
      subject: 'Your password has been changed',
      template: 'resetPassword',
      variables: { userName: user.userName },
    });
  }

  return result;
};
const updateStatusById = async (id) => {
  const user = await User.findById(id);
  
  user.isActive = !user.isActive;
  
  return await user.save();
}
const deleteUserById = async (id) => {
  const user = await User.findByIdAndUpdate(
    id,
    { deletedAt: new Date(), isActive: false },
    { new: true }
  );
  return user;
};

module.exports = { getUsers, getUserById, createUser, updateUserById, updateStatusById, deleteUserById };

// const updateUserById = async (id, req) => {
//   const { file, body } = req;
//   const storageType = 'public';  //mention s3 or public
//   const data = { ...body };
//   delete data.storageType;

//   if (file) {
//     const oldUser = await User.findById(id);
//     if (oldUser?.profile) {
//       await deleteFile(oldUser.profile, oldUser.profileStorageType || storageType);
//     }

//     if (storageType === 's3') {
//       data.profile = await uploadFile(file, 'uploads', storageType);
//     } else {
//       data.profile = `uploads/${file.filename}`;
//     }
//     data.profileStorageType = storageType;
//   }

//   const user = await User.findByIdAndUpdate(id, data, { new: true })
//     .populate('roles', 'name')
//     .select('-password');

//   if (user?.profile) {
//     user._doc.profileUrl = resolveFileUrl(user.profile, user.profileStorageType || 's3');
//   }
//   return user;
// };