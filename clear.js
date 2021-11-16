const mongoose = require('mongoose');
require('dotenv').config();
const Location = require('./Models/Location.js');

async function clear() {
  mongoose.connect(process.env.DB_URL);
  try {
    await Location.deleteMany({});
    console.log('Locations cleared');
  } catch (err) {
    console.error(err)
  } finally {
    mongoose.disconnect();
  }
}

//clear();