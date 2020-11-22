const express = require('express');
const app = express();

app.use("/api/user", require("../Controller/User"));
app.use("/api", require("../Controller/AuthController"));