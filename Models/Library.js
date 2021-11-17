"use strict";

const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({
  locations: Array,
  email: String, //from auth0
  reviews: Array,
});

const Lib = mongoose.model("Library", librarySchema);

module.exports = Lib;
