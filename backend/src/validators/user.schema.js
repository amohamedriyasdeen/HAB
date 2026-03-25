const Joi = require('joi');

const createUserSchema = Joi.object({
  userName: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).optional().allow(''),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    .messages({ 'any.only': 'Passwords do not match' }),
});

const updateUserSchema = Joi.object({
  userName: Joi.string().trim().min(2).max(50).required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).optional().allow(''),
  password: Joi.string().min(6).optional(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).when('password', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }).messages({ 'any.only': 'Passwords do not match' }),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(50).optional().allow(''),
  lastName:  Joi.string().trim().min(1).max(50).optional().allow(''),
  userName:  Joi.string().trim().min(3).max(30).lowercase().pattern(/^[a-z0-9_]+$/).optional().allow('')
    .messages({ 'string.pattern.base': 'Username can only contain letters, numbers and underscores' }),
  mobile:    Joi.string().pattern(/^[0-9]{7,15}$/).optional().allow(''),
  address:   Joi.string().trim().max(200).optional().allow(''),
  country:   Joi.string().optional().allow(''),
  state:     Joi.string().optional().allow(''),
  city:      Joi.string().optional().allow(''),
  pincode:   Joi.string().optional().allow(''),
});

module.exports = { createUserSchema, updateUserSchema, updateProfileSchema };