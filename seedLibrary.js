const { test } = require("media-typer");
const mongoose = require("mongoose");
const { disconnect } = require("process");
require("dotenv").config();

const Library = require("./Models/Library.js");

async function seed() {
  mongoose.connect(process.env.DB_URL);
  await Library.create({
    locations: ["619306d8731c488031fe809a", "619306d9731c488031fe809d"],
    email: "brannlee808@gmail.com",
    reviews: ["6194478fe2ac666f3cb06423"],
  });
  mongoose.disconnect();
}

seed();
