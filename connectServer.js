const express = require('express');
const mongoose = require('mongoose');
const app = express();
const mongoDBErrors = require("mongoose-mongodb-errors");

require('dotenv').config();

const mongo_URI = "mongodb+srv://test-user:bwEbCBwka1CE1aum@azureclustertest.chctgv2.mongodb.net/AzureClusterTestDB?retryWrites=true&w=majority";

mongoose.Promise = global.Promise;
mongoose.plugin(mongoDBErrors);
mongoose.connect(mongo_URI,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('connection establised');
}).catch((error) => {
    console.error('error in connection establise');
});
