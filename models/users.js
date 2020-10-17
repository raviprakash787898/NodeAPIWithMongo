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
        type: String,
        required: true
    },
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