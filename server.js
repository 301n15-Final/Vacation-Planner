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
app.use(express.urlencoded({ extended: true })); //allows working with encoded data from APIs
app.set('view engine', 'ejs');

// Using middleware to change browser's POST into PUT
app.use(methodOverride((req) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
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

app.get('/result', (req, res) => res.status(200).render('index'));
app.get('/about', (req, res) => res.status(200).render('pages/about'));

app.get('*', (req, res) => res.status(404).send('404'));

// Ensure that the server is listening for requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Functions (temporary - will go into modules)
// Weather constructor
function Weather(weather) {
  this.day = (new Date(weather.time * 1000)).toString().substring(0, 10);
  this.summary = weather.summary;
  this.temperature = ((weather.temperatureHigh + weather.temperatureLow) / 2).toFixed(0);
  this.precipType = weather.precipType;
  this.icon_url = weather.icon ? `../img/icons/${weather.icon}.png` : `../img/icons/undefined.png`;
}

function Country(country) {
  this.country = country.name;
  this.capital = country.capital;
  this.population = country.population;
  this.borders = country.borders;
  this.currencies = country.currencies.map(curr => curr.name);
  this.languages = country.languages.map(lang => lang.name);
  this.flag_url = country.flag;
}

// Getting location from Google API and returning lat/long
async function getLocation(city) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`;
  try {
    const data = await superagent.get(url);
    const location = data.body.results[0].geometry.location;
    const countryCode = data.body.results[0].address_components.filter(el => el.types[0] === 'country')[0].short_name;
    console.log(countryCode);
    return { location: location, code: countryCode };
  } catch (err) {
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
  } catch (err) {
    console.log(err);
  }
}

//
async function getCountryData(code) {
  const url = `https://restcountries.eu/rest/v2/alpha/${code}?fullText=true`;
  const countryData = await superagent.get(url);
  return new Country(countryData.body);
}

// Getting the days of the vacation
function getDays(vacation) {
  const startDate = Date.parse(vacation.start_date) / 1000;
  const endDate = Date.parse(vacation.end_date) / 1000;
  const numberOfDays = ((endDate - startDate) / 86400) + 1;
  const days = [];

  for (let i = 0; i < numberOfDays; i++) {
    days.push(startDate + 86400 * i);
  }

  return days;
}

// Rendering forecasted (if exists) or historical weather
async function weatherHandler(req, res) {
  try {
    const geo = await getLocation(req.body.city);
    const days = getDays(req.body);
    const countryData = await getCountryData(geo.code);

    console.log(countryData);

    const weather = await Promise.all(days.map(day => getWeather(geo.location, day)))
      .then(data => data.map(forecast => new Weather(forecast[0])))
      .catch(err => console.log(err));
    console.log(weather);
    res.status(200).render('pages/result', { weather: weather, country: countryData, request: req.body });
  } catch (err) {
    res.status(200).render('pages/error', { err: err });
  }
}
