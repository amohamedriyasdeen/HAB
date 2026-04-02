require('../helpers/setup');
const { request, app, TEST_USER, SUPER_ADMIN, login, authHeader } = require('../helpers/testUtils');
const mongoose = require('mongoose');
const User = require('../../src/models/user.model');

let userTokens;
let adminTokens;

beforeAll(async () => {
  userTokens  = await login(TEST_USER);
  adminTokens = await login(SUPER_ADMIN);
});

afterEach(async () => {
  await mongoose.connection.collection('refreshtokens').deleteMany({});
  userTokens  = await login(TEST_USER);
  adminTokens = await login(SUPER_ADMIN);
});

describe('GET /api/auth/me — authenticated access', () => {
  it('returns user data with valid token', async () => {
    const res = await request(app).get('/api/auth/me').set(authHeader(userTokens.accessToken));
    expect(res.status).toBe(200);
    expect(res.body.data.user).toHaveProperty('email', TEST_USER.email);
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/user/fetch-all-users — role-based access', () => {
  it('allows super-admin to fetch all users', async () => {
    const res = await request(app).get('/api/user/fetch-all-users').set(authHeader(adminTokens.accessToken));
    expect(res.status).toBe(200);
  });

  it('denies regular user from fetching all users', async () => {
    const res = await request(app).get('/api/user/fetch-all-users').set(authHeader(userTokens.accessToken));
    expect(res.status).toBe(403);
  });

  it('denies unauthenticated request', async () => {
    const res = await request(app).get('/api/user/fetch-all-users');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/user/create — role-based access', () => {
  afterEach(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: 'new@example.com' });
    await mongoose.connection.collection('users').deleteOne({ email: 'new2@example.com' });
  });

  it('allows super-admin to create user', async () => {
    const res = await request(app).post('/api/user/create')
      .set(authHeader(adminTokens.accessToken))
      .send({ email: 'new@example.com', password: 'New@1234', confirmPassword: 'New@1234', userName: 'newuser' });
    expect(res.status).toBe(200);
  });

  it('denies regular user from creating user', async () => {
    const res = await request(app).post('/api/user/create')
      .set(authHeader(userTokens.accessToken))
      .send({ email: 'new2@example.com', password: 'New@1234', confirmPassword: 'New@1234', userName: 'newuser2' });
    expect(res.status).toBe(403);
  });
});

describe('Inactive user access', () => {
  it('denies inactive user from accessing protected routes', async () => {
    await User.findOneAndUpdate({ email: TEST_USER.email }, { isActive: false });
    const res = await request(app).get('/api/auth/me').set(authHeader(userTokens.accessToken));
    expect(res.status).toBe(403);
    await User.findOneAndUpdate({ email: TEST_USER.email }, { isActive: true });
  });
});
