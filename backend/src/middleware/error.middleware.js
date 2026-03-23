const apiResponse = require("../utils/apiResponse");
const ERROR_MAP = require('../errors/errorMap');

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.name, '-', err.message);
    
    const errorConfig = ERROR_MAP[err.name] || ERROR_MAP.DEFAULT;

    const statusCode = err.statusCode || errorConfig.statusCode;
    const message = err.message || errorConfig.message;

    const errors = errorConfig.formatErrors
        ? errorConfig.formatErrors(err)
        : null;
    
    const err_name = err.name || 'INTERNAL_ERROR';
        
    return apiResponse.error(res, message, errors, statusCode, err_name);
}

module.exports = errorHandler;