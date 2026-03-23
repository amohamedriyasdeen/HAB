const apiResponse = {
    success: (res, message = 'Success', data = null, statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            code: statusCode,
        });
    },

    error: (
        res,
        message = 'Something went wrong',
        errors = null,
        statusCode = 500
    ) => {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
            code: statusCode,
        });
    },
};

module.exports = apiResponse;
