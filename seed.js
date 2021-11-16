const mongoose = require('mongoose');
require('dotenv').config;
const locationData = require('./Locations.json');

const Location = require('./Models/Location.js');
const locationArray = JSON.parse(locationData);

async function seed() {
    mongoose.connect(process.env.DB_URL);

    await locationArray.forEach(location => {
        await Location.create({
            city: location.city,
            country: location.country,
            description: location.description,
            location: location.location,
            state: location.state,
            state_abbrev: location.state_abbrev,
            longitude: location.longitude,
            latitude: location.latitude,
            city_longitude: location.city_longitude,
            city_latitude: location.city_latitude,
            images: []
        });
    });

    mongoose.disconnect();
}

seed();