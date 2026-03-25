const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const activeProviders = require('../config/oauthConfig');
const { login, register, refreshToken, logout, me, verifyToken, forgotPassword, resetPassword, verifyResetToken, oauthCallback } = require('../controllers/auth.controller');
const env = require('../config/appConfig');
const { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validators/auth.schema');
const { validate, validateParams } = require('../validators/validate');
const { tokenParamSchema } = require('../validators/param.schema');
const { authCheck } = require('../middleware/auth.middleware');

router.post('/login', validate(loginSchema), login);
router.post('/register', validate(registerSchema), register);
router.get('/me', authCheck, me);
router.get('/verify-token', authCheck, verifyToken);
router.post('/refresh-token', refreshToken);
router.post('/logout', authCheck, logout);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validateParams(tokenParamSchema), validate(resetPasswordSchema), resetPassword);
router.get('/verify-reset-token/:token', validateParams(tokenParamSchema), verifyResetToken);

// OAuth routes — only registered for active providers with valid credentials
Object.keys(activeProviders).forEach((provider) => {
  router.get(`/${provider}`, passport.authenticate(provider, { session: false }));
  router.get(`/${provider}/callback`,
    passport.authenticate(provider, { session: false, failureRedirect: `${env.FRONTEND_URL}/#/oauth/error` }),
    oauthCallback
  );
});

module.exports = router;