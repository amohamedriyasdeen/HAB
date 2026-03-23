/**
 * Server Entry Point
 * Initializes and starts the Express server with proper error handling
 */

const dotenv = require('dotenv');
dotenv.config();

const env = require('./src/config/appConfig');
const app = require('./src/app');
const apiResponse = require('./src/utils/apiResponse');

const PORT = Number(env.PORT);
const NODE_ENV = env.NODE_ENV;

app.get('/', (req, res) => {
    return apiResponse.success(res, 'API is up and running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});