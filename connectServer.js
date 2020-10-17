const express = require('express');
const mongoose = require('mongoose');
const app = express();
const mongoDBErrors = require("mongoose-mongodb-errors");

require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.plugin(mongoDBErrors);
mongoose.connect(process.env.MONGO_URI,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('connection establised');
}).catch((error) => {
    console.error('error in connection establise');
});