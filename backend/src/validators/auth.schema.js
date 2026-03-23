const Joi = require('joi');

exports.loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email cannot be empty',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required'
  })
});

exports.registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email cannot be empty',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required'
  }),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
    'string.pattern.base': 'Mobile number must be 10 digits'
  })
});

exports.forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email cannot be empty',
    'any.required': 'Email is required'
  })
});

exports.resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required'
  })
});