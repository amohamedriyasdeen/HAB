require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const env = require('../../config/appConfig');
const User = require('../../models/user.model');
const Role = require('../../models/role.model');

const users = [
  { userName: 'abc', email: 'abc@gmail.com', password: '12345678', role: 'user' },
  { userName: 'superadmin', email: 'sa@gmail.com', password: '12345678', role: 'super-admin' },
  { userName: 'admin', email: 'admin@gmail.com', password: '12345678', role: 'admin' },
];

async function seedUsers() {
  try {
    await mongoose.connect(`${env.MONGODB_URI}/${env.DATABASE_NAME}`, {
      autoIndex: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB Connected');

    for (const u of users) {
      const role = await Role.findOneAndUpdate(
        { name: u.role },
        { name: u.role },
        { upsert: true, new: true }
      );

      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`Skipped (already exists): ${u.email}`);
        continue;
      }

      await User.create({
        userName: u.userName,
        email: u.email,
        password: u.password,
        roles: [role._id],
        isActive: true,
      });

      console.log(`Created: ${u.email} [${u.role}]`);
    }

  } catch (error) {
    console.error('Seeder Failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  }
}

seedUsers();
