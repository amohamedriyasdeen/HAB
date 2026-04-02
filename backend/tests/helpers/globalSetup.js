process.env.NODE_ENV            = 'test';
process.env.PORT                = '9999';
process.env.BASE_URL            = 'http://localhost:9999';
process.env.FRONTEND_URL        = 'http://localhost:5173';
process.env.ALLOWED_ORIGINS     = 'http://localhost:5173';
process.env.MONGODB_URI         = 'mongodb://localhost:27017';
process.env.DATABASE_NAME       = 'hab_test';
process.env.JWT_SECRET          = 'test_jwt_secret_32chars_minimum!!';
process.env.JWT_REFRESH_SECRET  = 'test_refresh_secret_32chars_min!!';
process.env.AUTH_BASE           = 'token';

const mongoose = require('mongoose');

module.exports = async () => {
  await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DATABASE_NAME}`);

  const Role = require('../../src/models/role.model');
  const User = require('../../src/models/user.model');

  // Drop and re-seed clean state
  await mongoose.connection.collection('users').deleteMany({});
  await mongoose.connection.collection('roles').deleteMany({});
  await mongoose.connection.collection('refreshtokens').deleteMany({});

  const ROLES = ['user', 'admin', 'super-admin'];
  for (const name of ROLES) {
    await Role.findOneAndUpdate({ name }, { name }, { upsert: true, new: true });
  }

  const SEED_USERS = [
    { userName: 'superadmin', email: 'sa@gmail.com',    password: '12345678', role: 'super-admin' },
    { userName: 'admin',      email: 'admin@gmail.com', password: '12345678', role: 'admin' },
    { userName: 'abc',        email: 'abc@gmail.com',   password: '12345678', role: 'user' },
  ];

  for (const u of SEED_USERS) {
    const role = await Role.findOne({ name: u.role });
    await User.create({ userName: u.userName, email: u.email, password: u.password, roles: [role._id], isActive: true });
  }

  await mongoose.disconnect();
};
