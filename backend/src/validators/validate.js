const validate = (schema) => (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    const error = new Error('Request body cannot be empty');
    error.name = 'EMPTY_BODY';
    error.statusCode = 400;
    return next(error);
  }

  const { error: validationError, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true, context: { req } });
  if (validationError) {
    validationError.name = 'ValidationError';
    validationError.statusCode = 422;
    return next(validationError);
  }
  req.body = value;
  next();
};

const validateParams = (schema) => (req, res, next) => {
  const { error: validationError } = schema.validate(req.params, { abortEarly: false });
  if (validationError) {
    validationError.name = 'ValidationError';
    validationError.statusCode = 422;
    return next(validationError);
  }
  next();
};

module.exports = { validate, validateParams };
