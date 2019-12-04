'use strict';
// Basic server setup
// Declare Application Dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const superagent = require('superagent');
const methodOverride = require('method-override');

// Load Environment variable from the .env
require('dotenv').config();

// Application setup
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.urlencoded({extended: true})); //allows working with encoded data from APIs
app.set('view engine', 'ejs');

// Using middleware to change browser's POST into PUT
app.use(methodOverride( (req, res) => {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// Importing callback functions


// Routes
// Serving static folder
app.use(express.static(path.join(__dirname, 'public')));

// Specifying route
app.get('/', (req, res) => res.status(200).render('index'));
app.post('/', weatherHandler);

app.get('*', (req, res) => res.status(404).send('404'));

// Ensure that the server is listening for requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Functions (temporary - will go into modules)

// Getting location from Google API and returning lat/long
async function getLocation(city) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`;
  try {
    const data = await superagent.get(url);
    return data.body.results[0].geometry.location;
  } catch(err) {
    console.log(err);
  }
}

// Getting weather (forecast or history)
async function getWeather(location, time) {
  try {
    const url = time ? `https://api.darksky.net/forecast/${process.env.WEATHER_API}/${location.lat},${location.lng},${time}`
                    : `https://api.darksky.net/forecast/${process.env.WEATHER_API}/${location.lat},${location.lng}`;
    const data = await superagent.get(url);
    return data.body.daily.data;
  } catch(err) {
    console.log(err);
  }
}

// Rendering forecasted (if exists) or historical weather
async function weatherHandler(req, res) {
  try {
    const location = await getLocation(req.body.city);
    let weather = await getWeather(location);
    const maxForecastedDate = weather.map(day => day.time)[weather.length-1];
    let tripDate = new Date(req.body.date).getTime() / 1000; //converting user entered date into UNIX timestamp
    if(maxForecastedDate < tripDate) {
      tripDate = tripDate - 31556926; // one year back
      weather = await getWeather(location, tripDate);
    }
    res.status(200).render('pages/result', { weather: weather });
  } catch (err) {
    res.status(200).render('pages/error', { err: err });
  }
}