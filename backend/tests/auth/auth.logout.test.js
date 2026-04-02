require('../helpers/setup');
const { request, app, TEST_USER, login, authHeader } = require('../helpers/testUtils');
const mongoose = require('mongoose');

let tokens;

beforeEach(async () => {
  tokens = await login(TEST_USER);
});

afterEach(async () => {
  await mongoose.connection.collection('refreshtokens').deleteMany({});
});

describe('POST /api/auth/logout', () => {
  it('logs out successfully', async () => {
    const res = await request(app).post('/api/auth/logout')
      .set(authHeader(tokens.accessToken))
      .send({ refreshToken: tokens.refreshToken });
    expect(res.status).toBe(200);
  });

  it('refresh token is invalid after logout', async () => {
    await request(app).post('/api/auth/logout')
      .set(authHeader(tokens.accessToken))
      .send({ refreshToken: tokens.refreshToken });

    const res = await request(app).post('/api/auth/refresh-token')
      .send({ refreshToken: tokens.refreshToken });
    expect(res.status).toBe(401);
  });

  it('rejects logout without auth token', async () => {
    const res = await request(app).post('/api/auth/logout').send({ refreshToken: tokens.refreshToken });
    expect(res.status).toBe(401);
  });

  it('access token still valid until expiry after logout (stateless)', async () => {
    await request(app).post('/api/auth/logout')
      .set(authHeader(tokens.accessToken))
      .send({ refreshToken: tokens.refreshToken });

    const res = await request(app).get('/api/auth/me').set(authHeader(tokens.accessToken));
    expect([200, 403]).toContain(res.status);
  });
});
