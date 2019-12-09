'use strict';
// Basic server setup
// Declare Application Dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const methodOverride = require('method-override');
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

// IMPORTING MODULES
const initializePassport = require('./modules/passport-config');
initializePassport(
  passport,
  findUser,
  findUser
);
const resultsHandler = require('./modules/results');
const registerUser = require('./modules/users');


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

// MIDDLEWARES
// Using middleware to change browser's POST into DELETE
app.use(methodOverride('_method'));

// Middlewares for checking user authentication
// Use this functions for routes that user cannot access being logged out
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Use this functions for routes that user cannot access being logged in
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

// Routes
// Serving static folder
app.use(express.static(path.join(__dirname, 'public')));

// Specifying routes
app.get('/', (req, res) => res.status(200).render('index'));
app.post('/', resultsHandler);

app.get('/login', checkNotAuthenticated, (req, res) => res.status(200).render('pages/login'));
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => res.status(200).render('pages/register'));
app.post('/register', checkNotAuthenticated, registerUser);

app.get('/profile', checkAuthenticated, userProfileHandler);

app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

app.get('/result', checkAuthenticated, async (req, res) => {
  const user = await req.user;
  return res.status(200).render('index', { name: user.first_name });
});
app.get('/about', (req, res) => res.status(200).render('pages/about'));

app.get('*', (req, res) => res.status(404).send('404'));

// Ensure that the server is listening for requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Functions (temporary - will go into modules)

async function findUser(key, value) {
  let sql = `SELECT login.traveler_id AS id, 
  login.email AS email, 
  login.hashpass AS password, 
  traveler.first_name AS first_name, 
  traveler.last_name AS last_name, 
  traveler.summer_temp_lowest AS summer_temp,
  traveler.fall_temp_lowest AS fall_temp
  FROM login
  JOIN traveler
  ON login.traveler_id = traveler.id
  WHERE ${key} = $1;`;
  try {
    const data = await client.query(sql, [value]);
    return data.rows[0];
  } catch (err) {
    console.log(err);
  }
}

async function userProfileHandler(req, res) {
  const user = await req.user;
  return res.status(200).render('pages/profile', { user: user });
}
