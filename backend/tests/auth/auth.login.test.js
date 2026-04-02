require('../helpers/setup');
const { request, app, TEST_USER, SUPER_ADMIN } = require('../helpers/testUtils');
const mongoose = require('mongoose');

afterEach(async () => {
  await mongoose.connection.collection('refreshtokens').deleteMany({});
});

describe('POST /api/auth/login', () => {
  it('logs in with valid credentials and returns tokens', async () => {
    const res = await request(app).post('/api/auth/login').send(TEST_USER);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
  });

  it('rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: TEST_USER.email, password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('rejects non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nobody@example.com', password: '12345678' });
    expect(res.status).toBe(401);
  });

  it('does NOT set httpOnly cookies in token mode', async () => {
    const res = await request(app).post('/api/auth/login').send(TEST_USER);
    const cookies = res.headers['set-cookie'] || [];
    expect(cookies.some(c => c.startsWith('accessToken'))).toBe(false);
  });

  it('rejects missing email', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: '12345678' });
    expect(res.status).toBe(422);
  });
});

describe('POST /api/auth/register', () => {
  afterEach(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: 'newreg@example.com' });
  });

  it('registers a new user and returns tokens', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'newreg@example.com', password: 'Test@1234', mobile: '9999999999',
    });
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('accessToken');
  });

  it('rejects duplicate email', async () => {
    await request(app).post('/api/auth/register').send({ email: 'newreg@example.com', password: 'Test@1234', mobile: '9999999999' });
    const res = await request(app).post('/api/auth/register').send({ email: 'newreg@example.com', password: 'Test@1234', mobile: '9999999999' });
    expect(res.status).toBe(400);
  });

  it('rejects missing email', async () => {
    const res = await request(app).post('/api/auth/register').send({ password: 'Test@1234' });
    expect(res.status).toBe(422);
  });

  it('rejects weak password', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'x@x.com', password: '123' });
    expect(res.status).toBe(422);
  });
});
