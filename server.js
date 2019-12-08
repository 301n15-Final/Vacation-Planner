'use strict';
// Basic server setup
// Declare Application Dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const superagent = require('superagent');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt'); // for hashing passwords
const passport = require('passport'); // for dealing with login
const flash = require('express-flash'); // express library
const session = require('express-session'); // express library

// Load Environment variable from the .env
require('dotenv').config();

// Connecting to DB
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));

// Importing modules
const initializePassport = require('./modules/passport-config');
initializePassport(
  passport,
  email => users.find( user => user.email === email),
  id => users.find( user => user.id === id)
);

// Application setup
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Using middleware to change browser's POST into DELETE
app.use(methodOverride('_method'));

// TEMPORARY LOGIN INFORMATION (will be moved to database)
const users = [];

// Routes
// Serving static folder
app.use(express.static(path.join(__dirname, 'public')));

// Specifying routes
app.get('/', (req, res) => res.status(200).render('index'));
app.post('/', resultsHandler);

app.get('/login', checkNotAuthenticated, (req, res) => res.status(200).render('pages/login'));
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => res.status(200).render('pages/register'));
app.post('/register', checkNotAuthenticated, registerUser);

app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

app.get('/result', checkAuthenticated, (req, res) => res.status(200).render('index', { name: req.user.name }));
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

// Country constructor
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

async function getForecast(days, location) {
  const weather = await Promise.all(days.map(day => getWeather(location, day)))
    .then(data => data.map(forecast => new Weather(forecast[0])))
    .catch(err => console.log(err));

  return weather;
}

// Retrieve additional country data
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

// Rendering result page
async function resultsHandler(req, res) {
  try {
    const geo = await getLocation(req.body.city); //get location info from google API
    const days = getDays(req.body); //count number of vacation days
    const countryData = await getCountryData(geo.code); //get country info
    const weather = await getForecast(days, geo.location); //get forecast info

    getData(req.body); //getting items from DB

    res.status(200).render('pages/result', { weather: weather, country: countryData, request: req.body });
  } catch (err) {
    res.status(200).render('pages/error', { err: err });
  }
}

// Middlewares for checking user authentication
// Use this functions for routes that user cannot access being logged out
function checkAuthenticated( req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Use this functions for routes that user cannot access being logged in
function checkNotAuthenticated( req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

async function getData(request) {
  const activityType = request.activities;
  const vacationType = request.vacation_type;
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
  const data = await client.query(sql, [activityType, vacationType]);
  console.log(activityType, vacationType);
  console.log(data.rows);
}

async function saveTraveler(r) {
  let sql = `INSERT INTO traveler (first_name, last_name, summer_temp_lowest, fall_temp_lowest)
  VALUES ($1, $2, $3, $4) RETURNING id;`;
  const data = await client.query(sql, [r.first_name, r.last_name, 50, 50]);
  return data.rows[0].id;
}

async function saveLogin(id, email, password) {
  let sql = `INSERT INTO login (traveler_id, email, hashpass)
  VALUES ($1, $2, $3) RETURNING traveler_id;`;
  const data = await client.query(sql, [id, email, password]);
  console.log(data.rows[0]);
}

async function registerUser(req, res) {
  try {
    console.log(req.body);
    const travelerId = await saveTraveler(req.body); // save user into traveler table
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // hash password
    await saveLogin(travelerId, req.body.email, hashedPassword); // save user into login table

    // <--------DELETE---------->
    users.push({
      id: Date.now().toString(),
      name: req.body.first_name,
      email: req.body.email,
      password: hashedPassword
    });
    console.log('users', users);
    // <--------DELETE---------->


    res.redirect('/login');
  } catch (err) {
    res.redirect('/register');
  }
}

async function findUser(email) {
  let sql = `SELECT id, email, hashpass AS password FROM login WHERE email LIKE $1;`;
  const data = await client.query(sql, [email]);
  console.log(data.rows[0]);
}
