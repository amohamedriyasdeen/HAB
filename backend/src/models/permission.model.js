const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    resource: {
        type: String,
        required: true
    },
    action: {
        type: String,
        enum: ['create', 'read', 'update', 'delete'],
        required: true
    },
    description: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model('Permission', permissionSchema);