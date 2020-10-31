'use strict';

//Add dependencies 
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const ejs = require('ejs');

//Load environment variables from .env
require('dotenv').config();

// Declare port
const PORT = process.env.PORT || 3000;

// Start express
const app = express();

// use CORS
app.use(cors());

// serve static css files
app.use(express.static('./public'));

// Decode POST data
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set('view engine', 'ejs');

// Routes
app.get('/', homeRoute);
app.get('/searches/new', handleSearch);

// Route functions
function homeRoute(req, res) {
  res.status(200).render('pages/index');
}

function handleSearch(req, res) {
  res.status(200).render('pages/searches/new');
}

// Listen on the port
app.listen(PORT, () => {
        console.log(`server is now listening on port ${PORT}`);
});
