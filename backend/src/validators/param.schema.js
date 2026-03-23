const Joi = require('joi');

const tokenParamSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Token cannot be empty',
    'any.required': 'Token is required'
  })
});

const idParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    'string.empty': 'ID cannot be empty',
    'string.hex': 'ID must be a valid hexadecimal',
    'string.length': 'ID must be 24 characters long',
    'any.required': 'ID is required'
  })
});

module.exports = { tokenParamSchema, idParamSchema };
