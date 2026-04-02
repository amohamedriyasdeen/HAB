const request = require('supertest');
const app     = require('../../src/app');

// Matches seeder users
const SUPER_ADMIN = { email: 'sa@gmail.com',    password: '12345678' };
const ADMIN_USER  = { email: 'admin@gmail.com', password: '12345678' };
const TEST_USER   = { email: 'abc@gmail.com',   password: '12345678' };

const login = async (credentials) => {
  const res = await request(app).post('/api/auth/login').send(credentials);
  return res.body.data;
};

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

module.exports = { request, app, TEST_USER, ADMIN_USER, SUPER_ADMIN, login, authHeader };
