const express = require('express');
require("express-async-errors");
const app = express();
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
// if(app.get("env") === "production") {
//     app.use((error, req, res, next) => {
//         res.status(req.status || 500).send({
//             message: error.message
//         });
//     });
// }

app.use((error, req, res, next) => {
    res.status(req.status || 500).send({
        message: error.message
    });
});

// For Development purpose

// app.use((error, req, res, next) => {
//     res.status(req.status || 500).send({
//         message: error.message,
//         stack: error.stack
//     });
// });

app.listen(port, () => {
    console.log("Listen on "+ port +" port");
});