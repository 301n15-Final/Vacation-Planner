'use strict';

const superagent = require('superagent');

// Connecting to DB
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));

// Location constructor
function Location(location) {
  this.city = location.formatted_address.split(',')[0];
  this.location = location.geometry.location;
  this.countryCode = location.address_components.filter(el => el.types[0] === 'country')[0].short_name;
  this.country = location.address_components.filter(el => el.types[0] === 'country')[0].long_name;
}

// Weather constructor
function Weather(weather) {
  this.day = (new Date(weather.time * 1000)).toString().substring(0, 10);
  this.summary = weather.summary;
  this.temperature = ((weather.temperatureHigh + weather.temperatureLow) / 2).toFixed(0);
  this.precipType = weather.precipType;
  this.icon_url = weather.icon ? `../img/icons/${weather.icon}.png` : `../img/icons/undefined.png`;
}

// Country constructor
function Country(country) {
  this.country = country.name;
  this.capital = country.capital;
  this.population = country.population;
  this.borders = country.borders.join(', ');
  this.currencies = country.currencies.map(curr => curr.name).join(', ');
  this.languages = country.languages.map(lang => lang.name).join(', ');
  this.flag_url = country.flag;
}

// Getting location from Google API
async function getLocation(city) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`;
  try {
    const data = await superagent.get(url);
    return new Location(data.body.results[0]);
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

// Send multiple API calls for every day of user's vacation
async function getForecast(days, location) {
  const weather = await Promise.all(days.map(day => getWeather(location, day)))
    .then(data => data.map(forecast => new Weather(forecast[0])))
    .catch(err => console.log(err));

  return weather;
}

// Retrieve additional country data
async function getCountryData(code) {
  const url = `https://restcountries.eu/rest/v2/alpha/${code}?fullText=true`;
  try {
    const countryData = await superagent.get(url);
    return new Country(countryData.body);
  } catch (err) {
    console.log(err);
  }
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

// Getting list of suggested items from DB
async function getItems(form) {
  const activityType = form.activities;
  const vacationType = form.vacation_type;
  const sql = `SELECT standard_packing_item.name
  FROM standard_packing_item 
  JOIN standard_packing_item_activity_type 
  ON standard_packing_item.id = standard_packing_item_activity_type.standard_packing_item_id 
  JOIN standard_packing_item_vacation_type
  ON standard_packing_item.id = standard_packing_item_vacation_type.standard_packing_item_id
  WHERE activity_type_id = 
  (SELECT id FROM activity_type WHERE LOWER(name) = $1)
  AND vacation_type_id =
  (SELECT id FROM vacation_type WHERE LOWER(name) = $2);`;
  const items = await client.query(sql, [activityType, vacationType]);
  console.log('avtivity type:', activityType, '| vacation type', vacationType);
  return items.rows.map(record => record.name);
}

// Rendering result page
async function resultsHandler(req, res) {
  try {
    const geo = await getLocation(req.body.city); //get location info from google API
    const days = getDays(req.body); //count number of vacation days
    const countryData = await getCountryData(geo.countryCode); //get country info
    const weather = await getForecast(days, geo.location); //get forecast info
    const items = await getItems(req.body); //get items suggestion from database

    res.status(200).render('pages/result', {
      location: geo,
      weather: weather,
      country: countryData,
      request: req.body,
      items: items
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
}

function errorHandler(err, req, res) {
  res.status(500).render('pages/error', {err: err});
}

module.exports = resultsHandler;
