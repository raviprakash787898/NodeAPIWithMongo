const mongoose = require('mongoose');

const userRoleTable = new mongoose.Schema({
    roleId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("UserRoles", userRoleTable);