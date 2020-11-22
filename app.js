const express = require('express');
require("express-async-errors");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require('body-parser');
const morgan = require('morgan');

// DB connect 
require('./connectServer');

const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({
            extended: true
        })
    )
    .use(bodyParser.json())
    .use(morgan());

// Set Static Folder
app.use(express.static(path.join(__dirname,'./public')));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname,'/public/index.html'));
});

// Routes
// require('./routes/appRoute');
app.use("/api/user", require("./Controller/User"));
app.use("/api", require("./Controller/AuthController"));

// Route mismatch error
app.use((req, res, next) => {
    req.status = 400;
    const error = new Error("Route does not match");
    next(error);
});

// Error Route Handler
app.use((error, req, res, next) => {
    res.status(req.status || 500).send({
        message: error.message
    });
});

// For Development purpose
app.listen(port, () => {
    console.log("Listen on "+ port +" port");
});