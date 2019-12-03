'use strict';
// Basic server setup
// Declare Application Dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
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
app.get('/', (req, res) => res.status(200).send('Hello World'));

app.get('*', (req, res) => res.status(404).send('404'));


// Ensure that the server is listening for requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));