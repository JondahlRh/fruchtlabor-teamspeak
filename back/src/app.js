require("dotenv").config({ path: "../.env" });
require("module-alias/register");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const HttpError = require("./models/http-error");
const userRoutes = require("./routes/users");

const app = express();

app.use(bodyParser.json());

// cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

// routes
app.use("/users", userRoutes);

app.use((req, res, next) => {
  next(new HttpError("Not Found", 404));
});

app.use((error, req, res, next) => {
  if (res.headerSent) return next(error);

  res.status(error.httpCode || 500);
  res.json({ message: error.message || "Internal Server Error" });
});

// mongodb
const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB, { dbName: process.env.MODE })
  .then(() => {
    console.log("Connected to MongoDB");
    console.log(`Listening at http://localhost:${port}/`);
    app.listen(port);
  })
  .catch((err) => {
    console.log("Connection to MongoDB failed");
    console.error(err.message);
  });
