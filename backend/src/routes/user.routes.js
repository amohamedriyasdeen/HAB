const express = require('express');
const router = express.Router();
const { authCheck } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/checkRole.middleware');
const { getUsers, getUser, createUser, updateUser, updateProfile, updateUserStatus, deleteUser } = require('../controllers/user.controller');
const { validate, validateParams } = require('../validators/validate');
const { idParamSchema } = require('../validators/param.schema');
const { uploadSingle } = require('../utils/fileUpload');
const { updateUserSchema, createUserSchema, updateProfileSchema } = require('../validators/user.schema');

// --- Specific routes first (before /:id wildcard) ---
router.get('/fetch-all-users', authCheck, checkRole('super-admin'), getUsers);
router.post('/create', authCheck, checkRole('super-admin'), validate(createUserSchema), createUser);
router.put('/profile', authCheck,
  uploadSingle('uploads/profiles', 'file', 'public', ['jpeg', 'jpg', 'png', 'gif', 'webp']),
  validate(updateProfileSchema),
  updateProfile
);

// --- Param routes after ---
router.post('/status-change/:id', authCheck, validateParams(idParamSchema), checkRole('super-admin'), updateUserStatus);
router.get('/:id', authCheck, validateParams(idParamSchema), getUser);
router.post('/:id', authCheck, validateParams(idParamSchema), validate(updateUserSchema), updateUser);
router.delete('/:id', authCheck, validateParams(idParamSchema), deleteUser);

module.exports = router;
