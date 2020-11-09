'use strict';

//Add dependencies 
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const ejs = require('ejs');
const pg = require('pg');

//Load environment variables from .env
require('dotenv').config();

// Declare port
const PORT = process.env.PORT || 3000;

// Start express
const app = express();

// define client
const client = new pg.Client(process.env.DATABASE_URL);

// use CORS
app.use(cors());

// Serve static css files
app.use(express.static('./public'));

// Decode POST data
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set('view engine', 'ejs');

// Routes
app.get('/', homeRoute);
app.get('/searches/new', handleSearch);
app.get('/error', handleError);
app.get('/books/:id', singleBookReq);
app.post('/searches', searchProcessor);
app.post('/books', addBook);

//Constructors
function Books(search) {
  this.title = search.volumeInfo.title ? search.volumeInfo.title : 'Sorry, No Title Available';
  this.author = search.volumeInfo.authors ? search.volumeInfo.authors : 'Sorry, No Author Available';
  this.description = search.volumeInfo.description ? search.volumeInfo.description : 'Sorry, No Description Available';
  this.isbn = search.volumeInfo.industryIdentifiers ? search.volumeInfo.industryIdentifiers[0].identifier : 'no isbn available';
  this.image_url = search.volumeInfo.imageLinks ? search.volumeInfo.imageLinks.smallThumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
}

// Route functions
function homeRoute(req, res) {
  const getSQL = ` SELECT * FROM books`;
  client.query(getSQL)
    .then(savedBooks => {
      res.status(200).render('pages/index', { savedBooks: savedBooks.rows });
    })
    .catch(error => {
      handleError(req, res, error);
    });
}

function handleSearch(req, res) {
  res.status(200).render('pages/searches/new');
}

function handleError(req, res, error) {
  res.status(500).render('pages/error');
}

function singleBookReq (req, res) {
  const bookID = req.params.id;
  const getSQL = `SELECT * FROM books WHERE id = $1`;
  client.query(getSQL, [bookID])
    .then(results => { 
      res.status(200).render('pages/books/show', { book: results.rows[0] })
    })
    .catch(error => {
      handleError(req, res, error);
    });
}

function searchProcessor(req, res) {
  let APIURL = `https://www.googleapis.com/books/v1/volumes?q=`;
  const search = req.body.search;
  const selection = req.body.select;

  const max = 10;

  if(selection === 'title') {
    APIURL += `+intitle:${search}`;
  }
  if(selection === 'author') {
    APIURL += `+inauthor:${search}`;
  }

  superagent.get(APIURL) 
    .query(max)
    .then(data => {
      const arrOfBooks = data.body.items.map(search => {
        console.log(search.volumeInfo);
        return new Books(search);
      });
      res.status(200).render('pages/searches/show', {results: arrOfBooks});
    })
    .catch(error => {
      handleError(req, res, error);
    });
}

function addBook (req, res) {
  const insertInSql = `INSERT INTO books (author, title, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const params = [req.body.author, req.body.title, req.body.isbn, req.body.image_url, req.body.description];
  client.query(insertInSql, params)
    .then(book => {
      res.status(200).redirect(`/books/${book.rows[0].id}`)
    })
    .catch(error => {
      handleError(req, res, error);
    });
}

//Connect to DB
client.connect();

// Listen on the port
app.listen(PORT, () => {
        console.log(`server is now listening on port ${PORT}`);
});