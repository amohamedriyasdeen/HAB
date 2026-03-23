const express = require('express');
const router = express.Router();

const { authCheck } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/checkRole.middleware');
const { getUsers, getUser, updateUser, updateUserStatus, deleteUser, createUser } = require('../controllers/user.controller');
const { validate, validateParams } = require('../validators/validate');
const { idParamSchema } = require('../validators/param.schema');
const { uploadSingle } = require('../utils/imageUpload');
const { updateUserSchema, createUserSchema } = require('../validators/user.schema');

router.get('/fetch-all-users', authCheck, checkRole('super-admin'), getUsers);
router.post('/create', authCheck, checkRole('super-admin'), validate(createUserSchema), createUser);
router.get('/:id', authCheck, validateParams(idParamSchema), getUser);
router.post('/:id', authCheck, validateParams(idParamSchema), validate(updateUserSchema), updateUser);
// router.post('/:id', authCheck, validateParams(idParamSchema), uploadSingle('uploads', 'public'), validate(updateUserSchema), updateUser);
router.post('/status-change/:id', authCheck, validateParams(idParamSchema), checkRole('super-admin'), updateUserStatus);
router.delete('/:id',authCheck , validateParams(idParamSchema), deleteUser);

module.exports = router;