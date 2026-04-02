/**
 * Server Entry Point
 * Initializes and starts the Express server with proper error handling
 */

const dotenv = require('dotenv');
dotenv.config();

const env = require('./src/config/appConfig');
const app = require('./src/app');
const apiResponse = require('./src/utils/apiResponse');

if (!env) {
    console.error('[Server] Config is invalid. Fix the errors above. Server will not start.');
} else {
    app.get('/', (req, res) => {
        return apiResponse.success(res, 'API is up and running!');
    });

    app.listen(Number(env.PORT), () => {
        console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
}