require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../../config/appConfig');
const User = require('../../models/user.model');
const Role = require('../../models/role.model');
const Permission = require('../../models/permission.model');
const RefreshToken = require('../../models/refreshToken.model');

// --- Model registry --- add any new model here
const MODELS = { User, Role, Permission, RefreshToken };

// --- Seed data ---
const SEED_ROLES = ['user', 'admin', 'super-admin'];

const SEED_USERS = [
  { userName: 'superadmin', email: 'sa@gmail.com',    password: '12345678', role: 'super-admin' },
  { userName: 'admin',      email: 'admin@gmail.com', password: '12345678', role: 'admin' },
  { userName: 'abc',        email: 'abc@gmail.com',   password: '12345678', role: 'user' },
];

// --- DB connect/disconnect ---
const connect = async () => {
  await mongoose.connect(`${env.MONGODB_URI}/${env.DATABASE_NAME}`, {
    autoIndex: false, maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000, socketTimeoutMS: 45000,
  });
  console.log('MongoDB connected');
};

const disconnect = async () => {
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
};

// --- Commands ---
const seed = async () => {
  console.log('\n--- Seeding ---');
  for (const name of SEED_ROLES) {
    await Role.findOneAndUpdate({ name }, { name }, { upsert: true, new: true });
    console.log(`Role ensured: ${name}`);
  }

  for (const u of SEED_USERS) {
    const role = await Role.findOne({ name: u.role });
    const exists = await User.findOne({ email: u.email });
    if (exists) { console.log(`Skipped (exists): ${u.email}`); continue; }
    await User.create({ userName: u.userName, email: u.email, password: u.password, roles: [role._id], isActive: true });
    console.log(`Created: ${u.email} [${u.role}]`);
  }
  console.log('Seeding complete.\n');
};

const truncateAll = async () => {
  console.log('\n--- Truncating all collections ---');
  for (const [name, model] of Object.entries(MODELS)) {
    await model.collection.drop().catch(() => {});
    console.log(`${name}: dropped`);
  }
  console.log('Truncate complete.\n');
};

const truncateModel = async (names) => {
  console.log('\n--- Truncating specified collections ---');
  for (const name of names) {
    const model = MODELS[name];
    if (!model) {
      console.warn(`Unknown model: "${name}". Available: ${Object.keys(MODELS).join(', ')}`);
      continue;
    }
    await model.collection.drop().catch(() => {});
    console.log(`${name}: dropped`);
  }
  console.log('Truncate complete.\n');
};

// --- CLI ---
// Usage:
//   node seeder.js seed
//   node seeder.js truncate
//   node seeder.js truncate User
//   node seeder.js truncate User Role RefreshToken
const [,, command, ...args] = process.argv;

(async () => {
  try {
    await connect();

    if (command === 'seed') {
      await seed();
    } else if (command === 'truncate:all') {
      await truncateAll();
    } else if (command === 'truncate:model') {
      if (!args.length) {
        console.error('Specify model name(s). Available:', Object.keys(MODELS).join(', '));
        process.exit(1);
      }
      await truncateModel(args);
    } else {
      console.log(`
Usage:
  node seeder.js seed                              — seed roles and users
  node seeder.js truncate:all                      — drop ALL collections
  node seeder.js truncate:model User               — drop User only
  node seeder.js truncate:model User Role          — drop multiple

From root:
  npm run seed
  npm run truncate:all
  npm run truncate:model -- User
  npm run truncate:model -- User Role

From backend/:
  npm run seed
  npm run truncate:all
  npm run truncate:model -- User
  npm run truncate:model -- User Role

Available models: ${Object.keys(MODELS).join(', ')}
      `);
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await disconnect();
  }
})();
