const mongoose = require('mongoose');
const env = require('../config/appConfig');

const connectDB = async () => {
    try {
        await mongoose.connect(`${env.MONGODB_URI}/${env.DATABASE_NAME}`,
        {
            autoIndex: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB connected successfully');
    } catch(err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
}

module.exports = connectDB;