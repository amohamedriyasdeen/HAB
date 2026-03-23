const apiResponse = require('../utils/apiResponse');
const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');

router.get('/', (req, res) => {
  return apiResponse.success(res, 'API is up and running!', {
    version: 'v0',
    endpoints: {
      health: 'GET /v0/api/health',
      login: 'POST /v0/api/auth/login',
      register: 'POST /v0/api/auth/register'
    }
  });
});

router.get('/health', (req, res) => {
  return apiResponse.success(res, 'API Health is Good', {
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/user', userRoutes);

module.exports = router;