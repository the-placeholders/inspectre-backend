'use strict';

const LatLonClass = require('./LatLonClass.js');

const axios = require('axios');

async function handleLocationIq(req, res) {
   const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATION_IQ_TOKEN}&q=${req.query.city}&format=json`;
   let locationResults = await axios.get(url);
   console.log(locationResults.data)
}

module.exports = handleLocationIq;
