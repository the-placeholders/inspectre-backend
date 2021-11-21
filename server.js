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
// app.delete('/library/:id',handleDelLocations)

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
          let newUserLib = await Library.create({
              locations:[],
              email: email,
              reviews: []  
          });
          console.log(newUserLib);
          //not wrapping object in an array breaks the fontend for now
          res.status(201).send([newUserLib]);  
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
                const updatedData = {...req.body, __v: 0};
            try {
                const updatedLibrary = await Library.findOneAndUpdate({email: email},updatedData, {new: true});
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
    /*let city = req.query.city;
    city = city.toLowerCase();
    console.log(city[0]);
    city = city.replace(city[0],city[0].toUpperCase());*/
    let city = req.query.city;

    if(city){
      city = normalizeSearch(req.query.city);
    }
    
    let locationsFromDB = await Locations.find({
      city: city,
      state_abbrev: req.query.state,
    });
    if (locationsFromDB) {
      res.status(200).send(locationsFromDB);
    } else {
      res.status(404).send("Locations not found.");
    }
  } catch (e) {
    console.log(e);
    console.log(req.query.city);
    res.status(500).send("Server error.");
  }
}

function normalizeSearch(city) {
  city = city.trim();
  city = city.toLowerCase();
  city = city.replace(city[0],city[0].toUpperCase());
  return city;
}

// async function handleDelLocations(request,response){
//   const id = request.params.id;
//    try {
//         const delLocation = await Library.findOne({ _id: id });
//         if (!delLocation) {
//           response.status(400).send('could not delete location');
//         } else {
//           await Library.findByIdAndDelete(id);
//           response.status(204).send('loc gone ');
//         }
//       } catch (e) {
//         console.log(e);
//         response.status(500).send('server error');
//       }
//     }
  
 

const PORT = process.env.PORT || 3001;

app.listen(PORT || 3001, () => console.log(`listening on ${PORT}`));
