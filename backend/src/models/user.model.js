const mongoose = require('mongoose');
const crypt = require('../utils/crypt');
const env = require('../config/appConfig');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: function () {
            return !this.isOAuthUser;
        },
        select: false,
    },
    mobile: {
        type: String,
        trim: true,
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
    }],
    profile: {
        type: mongoose.Schema.Types.Mixed,
    },
    profileStorageType: {
        type: String,
        enum: ['s3', 'public'],
        default: null,
    },
    address: {
        type: String,
        trim: true,
    },
    country: String,
    state: String,
    city: String,
    pincode: String,
    lastLogin: {
        type: Date,
    },
    resetToken: {
        type: String,
    },
    resetTokenExpiry: {
        type: Date,
    },
    emailVerifiedAt: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isOAuthUser: {
        type: Boolean,
        default: false,
    },
    oauthProvider: {
        type: String,
    },
    oauthId: {
        type: String,
    },
    deletedAt: {
        type: Date,
    },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await crypt.hashPassword(this.password, env.SALT_ROUNDS);
    next();
});

module.exports = mongoose.model('User', userSchema);