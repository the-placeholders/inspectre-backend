const mongoose = require('mongoose');
require('dotenv').config();
const locationData = require('./Locations.json');
const Location = require('./Models/Location.js');

async function seed() {
    
    mongoose.connect(process.env.DB_URL);
    console.log('connected');
    for (let i = 0; i < locationData.length;i++) {
        await Location.create({
            city: locationData[i].city,
            country: locationData[i].country,
            description: locationData[i].description,
            location: locationData[i].location,
            state: locationData[i].state,
            state_abbrev: locationData[i].state_abbrev,
            longitude: locationData[i].longitude,
            latitude: locationData[i].latitude,
            city_longitude: locationData[i].city_longitude,
            city_latitude: locationData[i].city_latitude,
            images: []
        });
    }
    mongoose.disconnect();
}

seed();