'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const Locations = require('./Models/Location');
const verifyUser = require('./auth.js');
const handleLocationIq = require('./locationIq.js');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Mongoose is connected')
});

app.get('/location', handleGetCities);
app.get('/latlon', handleLocationIq);

app.get('/test', (req, res) => {
    verifyUser(req, (error, user) => {
        if (error) {
            res.send('invalid token');
        } else {
            res.send('test validated');
        }
    })
});

async function handleGetCities(req, res) {
    try {
        console.log(req.query.city);
        let locationsFromDB = await Locations.find({ city: req.query.city, state_abbrev: req.query.state });
        if (locationsFromDB) {
            res.status(200).send(locationsFromDB)
        } else {
            res.status(404).send('Locations not found.');
        }
    } catch (e) {
        console.log(req.query.city);
        res.status(500).send('Server error.');
    }
}

const PORT = process.env.PORT || 3001;

app.listen(PORT || 3001, () => console.log(`listening on ${PORT}`));
