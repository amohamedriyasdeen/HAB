require('../helpers/setup');
const { request, app, TEST_USER, login, authHeader } = require('../helpers/testUtils');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let tokens;

beforeAll(async () => {
  tokens = await login(TEST_USER);
});

afterEach(async () => {
  await mongoose.connection.collection('refreshtokens').deleteMany({});
  // Re-login to get fresh tokens after each cleanup
  tokens = await login(TEST_USER);
});

describe('POST /api/auth/refresh-token', () => {
  it('issues new access token with valid refresh token', async () => {
    const res = await request(app).post('/api/auth/refresh-token').send({ refreshToken: tokens.refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
  });

  it('rejects missing refresh token', async () => {
    const res = await request(app).post('/api/auth/refresh-token').send({});
    expect(res.status).toBe(401);
  });

  it('rejects tampered refresh token', async () => {
    const res = await request(app).post('/api/auth/refresh-token').send({ refreshToken: tokens.refreshToken + 'tampered' });
    expect(res.status).toBe(401);
  });

  it('rejects a token signed with wrong secret', async () => {
    const fakeToken = jwt.sign({ userId: 'fakeid', jti: 'fakejti', type: 'refresh' }, 'wrong_secret', { expiresIn: '7d' });
    const res = await request(app).post('/api/auth/refresh-token').send({ refreshToken: fakeToken });
    expect(res.status).toBe(401);
  });

  it('rejects an access token used as refresh token', async () => {
    const res = await request(app).post('/api/auth/refresh-token').send({ refreshToken: tokens.accessToken });
    expect(res.status).toBe(401);
  });

  it('rejects refresh token after logout (revocation)', async () => {
    const freshTokens = await login(TEST_USER);
    await request(app).post('/api/auth/logout').set(authHeader(freshTokens.accessToken)).send({ refreshToken: freshTokens.refreshToken });
    const res = await request(app).post('/api/auth/refresh-token').send({ refreshToken: freshTokens.refreshToken });
    expect(res.status).toBe(401);
  });
});

describe('Access token security', () => {
  it('rejects expired access token', async () => {
    const expiredToken = jwt.sign({ userId: 'someid' }, process.env.JWT_SECRET, { expiresIn: -1 });
    const res = await request(app).get('/api/auth/me').set(authHeader(expiredToken));
    expect(res.status).toBe(401);
  });

  it('rejects token signed with wrong secret', async () => {
    const fakeToken = jwt.sign({ userId: 'fakeid' }, 'wrong_secret', { expiresIn: '15m' });
    const res = await request(app).get('/api/auth/me').set(authHeader(fakeToken));
    expect(res.status).toBe(401);
  });

  it('rejects malformed token', async () => {
    const res = await request(app).get('/api/auth/me').set({ Authorization: 'Bearer not.a.valid.token' });
    expect(res.status).toBe(401);
  });

  it('rejects request with no token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects Bearer with empty token', async () => {
    const res = await request(app).get('/api/auth/me').set({ Authorization: 'Bearer ' });
    expect(res.status).toBe(401);
  });
});
