const express = require('express');
require("express-async-errors");
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

// DB connect 
require('./connectServer');

// Middleware
app.use(bodyParser.json())
    .use(morgan());

// Routes
app.use("/user", require("./Controller/User"));

// Route mismatch error
app.use((req, res, next) => {
    req.status = 400;
    const error = new Error("Route does not match");
    next(error);
});

// Error Route Handler
if(app.get("env") === "production") {
    app.use((error, req, res, next) => {
        res.status(req.status || 500).send({
            message: error.message
        });
    });
}

app.use((error, req, res, next) => {
    res.status(req.status || 500).send({
        message: error.message,
        stack: error.stack
    });
});

app.listen(3001, () => {
    console.log("Listen on 3001 port");
});