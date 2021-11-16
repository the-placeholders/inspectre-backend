'use strict';

const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    city: String,
    country: String,
    description: String,
    location: String,
    state: String,
    state_abbrev: String,
    longitude: Number,
    latitude: Number,
    city_longitude: Number,
    city_latitude: Number,
    images: Array
});

const Location = mongoose.model('Location',locationSchema);

module.exports = Location;