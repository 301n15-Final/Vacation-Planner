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


// IMPORTING MODULES
const callback = require('./modules/callbacks');
const findUser = callback.findUser;
const userProfileHandler = callback.userProfileHandler;
const resultsHandler = require('./modules/results');
const registerUser = require('./modules/users');
const initializePassport = require('./modules/passport-config');
initializePassport(
  passport,
  findUser,
  findUser
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

