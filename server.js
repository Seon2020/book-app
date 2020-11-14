'use strict';

//Add dependencies 
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const ejs = require('ejs');
const pg = require('pg');
const methodOverride = require('method-override');

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

// Utilize other HTTP verbs
app.use(methodOverride('_method'));

// Routes
// Get home page
app.get('/', homeRoute);
// Get new search page
app.get('/searches/new', handleSearch);
// Get error page 
app.get('/error', handleError);
// Get unique book page
app.get('/books/:id', singleBookReq);
// Post search results from query
app.post('/searches', searchProcessor);
// Post saved book to DB
app.post('/books', addBook);
// Save edits on individual book
app.put('/edit/:id', editBook);
// Remove book from DB
app.delete('/delete/:id', deleteBook);

//Constructor 
function Books(search) {
  this.title = search.volumeInfo.title ? search.volumeInfo.title : 'Sorry, No Title Available';
  this.author = search.volumeInfo.authors ? search.volumeInfo.authors : 'Sorry, No Author Available';
  this.description = search.volumeInfo.description ? search.volumeInfo.description : 'Sorry, No Description Available';
  this.isbn = search.volumeInfo.industryIdentifiers ? search.volumeInfo.industryIdentifiers[0].identifier : 'no isbn available';
  this.image_url = search.volumeInfo.imageLinks ? search.volumeInfo.imageLinks.thumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
}

// Route functions
function homeRoute(req, res) {
  // make sql query to select all from books table
  const getSQL = ` SELECT * FROM books`;
  //client query with sql query statement
  client.query(getSQL)
  //Pass the resulting data in the .then function
    .then(savedBooks => {
  //render the index (home) page with the data. savedBooks here is the property name and savedbooks.rows is an array of objects (value of that property. 
      res.status(200).render('pages/index', { savedBooks: savedBooks.rows });
    })
  // If unable to render that page, .catch will allow error function to run instead
    .catch(error => {
      handleError(req, res, error);
    });
}

// Generate the new search page '/searches/new' 
function handleSearch(req, res) {
  res.status(200).render('pages/searches/new');
}

// Generate error page when .catch catches an error '/pages/error'
function handleError(req, res, error) {
  res.status(500).render('pages/error');
}

// Generate the unique page for an individual book 'pages/books/show'
function singleBookReq (req, res) {
// get id of book where view details was clicked
  const bookID = req.params.id;
// Select that book from the DB
  const getSQL = `SELECT * FROM books WHERE id = $1`;
// Client query with id and sql statement
  client.query(getSQL, [bookID])
    .then(results => { 
// render show page for the book w/ row data
      res.status(200).render('pages/books/show', { book: results.rows[0] })
    })
    .catch(error => {
      handleError(req, res, error);
    });
}
// function to post search results from query
function searchProcessor(req, res) {
  // API url to get book data
  let APIURL = `https://www.googleapis.com/books/v1/volumes?q=`;
  // What user entered in search bar
  const search = req.body.search;
  // Did user select title or author?
  const selection = req.body.select;
  // Define max results
  const max = 10;
  //If user selected search by title 
  if(selection === 'title') {
  // Add +intitle: and const search to url
    APIURL += `+intitle:${search}`;
  }
  // If user selected search by author
  if(selection === 'author') {
  // Add +inauthor: and const search to url
    APIURL += `+inauthor:${search}`;
  }
  // Pass api url in superagent call
  superagent.get(APIURL) 
  // put the 10 max as a query param
    .query(max)
    .then(data => {
//get the items array of from api -map over it
      const arrOfBooks = data.body.items.map(search => {
// run data we get back through Books construc
        return new Books(search);
      });
// render those search results in show page
      res.status(200).render('pages/searches/show', {results: arrOfBooks});
    })
    .catch(error => {
      handleError(req, res, error);
    });
}
// function to add book to DB
function addBook (req, res) {
// INSERT statement 
  const insertInSql = `INSERT INTO books (author, title, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
//Define params for data to be inserted
  const params = [req.body.author, req.body.title, req.body.isbn, req.body.image_url, req.body.description];
// querty w/ sql statement and params
  client.query(insertInSql, params)
    .then(book => {
/* book.rows[0]: Row just inserted in the database.id: gets the id for that new row. User is redirected to the unique book page.*/
      res.status(200).redirect(`/books/${book.rows[0].id}`)
    })
    .catch(error => {
      handleError(req, res, error);
    });
}
//Function to save edits to book
function editBook (req, res) {
// sql statement to updated the data
  const sql = 'UPDATE books SET author = $1, title = $2, isbn = $3, image_url = $4, description = $5 WHERE id = $6';
// cache the book that user wants to edit
  const book = req.body;
// cache params for the book
  const params = [book.author, book.title, book.isbn, book.image_url, book.description, req.params.id];
// query with sql statement and params
  client.query(sql, params)
    .then(() => {
//redirect user to same page(for unique book)
      res.status(200).redirect(`/books/${req.params.id}`);
    })
    .catch(error => {
      handleError(req, res, error);
    });
}
// function to remove book from DB
function deleteBook (req, res) {
// swl statement to delete book
  const sql = 'DELETE FROM books WHERE id = $1'
// cache id of the book
  const params = [req.params.id];
// query with sql statement and param
  client.query(sql, params)
// Then redirect user to home (index)
    .then(() => res.status(200).redirect('/'))
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