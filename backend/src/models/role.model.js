const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['super-admin', 'admin', 'user'],
        default: 'user',
        required: true,
        unique: true
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
    }],
    description: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model('Role', roleSchema);