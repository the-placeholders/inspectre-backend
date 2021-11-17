"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const Locations = require("./Models/Location");
const Library = require("./Models/Library");
const verifyUser = require("./auth.js");
const handleLocationIq = require("./locationIq.js");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Mongoose is connected");
});

app.get("/location", handleGetCities);
app.get("/latlon", handleLocationIq);

app.get("/test", (req, res) => {
  verifyUser(req, (error, user) => {
    if (error) {
      res.send("invalid token");
    } else {
      res.send("test validated");
    }
  });
});

app.get("/library", (req, res) => {
  verifyUser(req, async (error, user) => {
    if (error) {
      res.send("invalid token");
    } else {
      try {
        const email = user.email;
        let userLib = await Library.find({ email });
        if (userLib.length > 0) {
          let locationData = await getLibLocations(userLib);
          console.log(locationData);
          console.log('if');
          let fullLib = {
              locations: locationData,
              email: email,
              reviews: []
          }
          //not wrapping object in an array breaks the fontend for now
          res.status(200).send([fullLib]);
        } else {
          console.log('else');  
          userLib = Library.create({
              locations:[],
              email: email,
              reviews: []  
          });
          //not wrapping object in an array breaks the fontend for now
          res.status(201).send([userLib]);  
        }
      } catch (e) {
        console.error(e);
        res.status(500).send(e);
      }
    }
  });
});

app.put('/library', (req,res)=> {
    verifyUser(req, async (error,user) => {
        if(error) {
             res.send('invalid token');
        }else {
                //const id = req.params.id;
                const email = user.email;
                const updatedData = {...req.body};
            try {
                const updatedLibrary = await Library.findOneAndUpdate({email: email},updatedData, {overwrite: true});
                console.log(updatedLibrary);
                res.status(200).send(updatedLibrary);
            } catch (e) {
                res.status(500).send('server error');
            }
        }
    })
});

async function getLibLocations(libObj) {
    //console.log(libObj);
    let locations = libObj[0].locations;
    //console.log('getting lib locations');
    let resData = await Locations.find({
        _id: { $in: locations}
    });
    return resData;
}

async function handleGetCities(req, res) {
  try {
    console.log(req.query.city);
    let locationsFromDB = await Locations.find({
      city: req.query.city,
      state_abbrev: req.query.state,
    });
    if (locationsFromDB) {
      res.status(200).send(locationsFromDB);
    } else {
      res.status(404).send("Locations not found.");
    }
  } catch (e) {
    console.log(req.query.city);
    res.status(500).send("Server error.");
  }
}



const PORT = process.env.PORT || 3001;

app.listen(PORT || 3001, () => console.log(`listening on ${PORT}`));
