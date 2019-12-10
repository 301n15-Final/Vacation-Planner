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


// Importing modules
const callback = require('./modules/callbacks');
const getUser = callback.getUser;
const userProfileHandler = callback.userProfileHandler;
const resultsHandler = require('./modules/results');
const registerUser = require('./modules/users');
const Trip = require('./modules/trips');
const getSavedTrips = Trip.getSavedTrips;
const saveTrip = Trip.saveTrip;
const initializePassport = require('./modules/passport-config');
initializePassport(passport, getUser);

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
app.use(methodOverride('_method'));

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

app.get('/trips', checkAuthenticated, getSavedTrips);
app.post('/trips', checkAuthenticated, saveTrip);

app.get('/about', (req, res) => res.status(200).render('pages/about'));

app.get('*', (req, res) => res.status(404).render('pages/error', {err: '404 - Page not found'}));

// Ensure that the server is listening for requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Functions (temporary - will go into modules)
