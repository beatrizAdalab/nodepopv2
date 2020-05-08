"use strict";

const mongoose = require("mongoose");
const db = mongoose.connection;

db.on("open", () => {
  console.log(" we are connected to", db.name);
});

db.on("error", (err) => {
  console.log("Connection error", err);
  process.exit(1);
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

module.exports = db;