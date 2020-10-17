const mongoose = require("mongoose");

const user_message = new mongoose.Schema({
    message: {
        type: String,
        required: "Message is required"
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

module.exports = mongoose.model("Messages", user_message);