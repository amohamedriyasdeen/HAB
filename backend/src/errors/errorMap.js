const ERROR_MAP = {
    DEFAULT: {
        statusCode: 500,
        message: 'Internal Server Error',
    },

    // ===== JSON Parsing =====
    SyntaxError: {
        statusCode: 400,
        message: 'Invalid JSON format',
    },

    INVALID_JSON: {
        statusCode: 400,
        message: 'Invalid JSON format in request body',
    },

    // ===== Joi =====
    JoiError: {
        statusCode: 422,
        message: 'Validation failed',
        formatErrors: err =>
            err.details.map(d => d.message.replace(/"/g, '')),
    },

    // ===== App / Config =====
    ENV_MISSING: {
        statusCode: 500,
        message: 'Required environment variables are missing',
    },

    ENV_INVALID: {
        statusCode: 500,
        message: 'Invalid environment variable configuration',
    },

    // ===== Routes =====
    ROUTE_NOT_FOUND: {
        statusCode: 404,
        message: 'Route not found',
    },

    // ===== CORS =====
    CORS_ERROR: {
        statusCode: 403,
        message: 'Not allowed by CORS policy',
    },

    // ===== Validation =====
    EMPTY_BODY: {
        statusCode: 400,
        message: 'Request body cannot be empty',
    },

    ValidationError: {
        statusCode: 422,
        message: 'Validation failed',
        formatErrors: err => {
            if (err.details) {
                return err.details.reduce((acc, detail) => {
                    const field = detail.path[0];
                    acc[field] = detail.message;
                    return acc;
                }, {});
            }
            if (err.errors) {
                return Object.keys(err.errors).reduce((acc, key) => {
                    acc[key] = err.errors[key].message;
                    return acc;
                }, {});
            }
            return null;
        }
    },

    CastError: {
        statusCode: 400,
        message: 'Invalid ID format',
    },

    MongoServerError: {
        statusCode: 400,
        message: 'Database error',
        formatErrors: err => {
            if (err.code === 11000) {
                const field = Object.keys(err.keyPattern)[0];
                return [`${field} already exists`];
            }
            return null;
        }
    },

    // ===== JWT =====
    JsonWebTokenError: {
        statusCode: 401,
        message: 'Invalid token',
    },

    TokenExpiredError: {
        statusCode: 401,
        message: 'Token expired',
    },

    // ===== Auth =====
    UNAUTHORIZED: {
        statusCode: 401,
        message: 'Unauthorized access',
    },

    FORBIDDEN: {
        statusCode: 403,
        message: 'Forbidden access',
    },
};

module.exports = ERROR_MAP;
