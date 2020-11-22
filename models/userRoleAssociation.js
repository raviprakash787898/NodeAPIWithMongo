const mongoose = require('mongoose');

const userRoleAssocTable = new mongoose.Schema({
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserRoles",
        required: "User is required"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: "User is required"
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("UserRoleAssociation", userRoleAssocTable);