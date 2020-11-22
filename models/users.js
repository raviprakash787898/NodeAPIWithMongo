const mongoose = require('mongoose');

const usersTable = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    phone: {
        type: String,
        required: true,
        maxlength: 10,
        minlength: 10
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserRoles"
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Messages",
            required: "Messages is required"
        }
    ]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("Users",usersTable);