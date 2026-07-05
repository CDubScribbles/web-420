/**
 * Author: Clifford Smith
 * Date: 06/14/2026
 * File Name: app.js
 * Description: Express application for the In-N-Out-Books project. Sets up
 *              the server, landing page route, the books API routes, and
 *              error handling middleware.
 */
"use strict";

// Import Express to create the application and define routes
const express = require("express");
// Import http-errors to create standardized HTTP error objects
const createError = require("http-errors");
// Import the mock database module containing book data
const books = require("../database/books");

// Create the Express application instance
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET route for the root URL - displays the In-N-Out-Books landing page
app.get("/", async (req, res, next) => {
  const html = `
  <html>
  <head>
    <title>In-N-Out-Books</title>
    <style>
      body, h1, h2, h3 { margin: 0; padding: 0; border: 0; }
      body {
        background: #1B1B2F;
        color: #fff;
        margin: 1.25rem;
        font-family: 'Georgia', serif;
        font-size: 1.1rem;
      }
      h1, h2, h3 { color: #E8C547; font-family: 'Georgia', serif; }
      h1, h2 { text-align: center; }
      .container { width: 60%; margin: 0 auto; }
      .book { border: 1px solid #E8C547; padding: 1rem; margin: 1rem 0; border-radius: 6px; }
      .book h3 { margin-top: 0; }
      footer { margin-top: 2rem; text-align: center; font-size: 0.95rem; color: #ccc; }
      address { font-style: normal; }
    </style>
  </head>
  <body>
    <div class="container">
      <header>
        <h1>In-N-Out-Books</h1>
        <h2>Your Books, In and Out, Without the Hassle</h2>
      </header>
      <br />
      <main>
        <section>
          <p>In-N-Out-Books is a simple platform for managing your personal book collection. Whether you're tracking what you've read, organizing a book club's shared shelf, or just love cataloging your library, In-N-Out-Books makes it easy to keep everything in one place.</p>
        </section>
        <br />
        <section>
          <h2>Top Selling Books</h2>
          <div class="book">
            <h3>The Way of Kings</h3>
            <p>By Brandon Sanderson</p>
          </div>
          <div class="book">
            <h3>Dune</h3>
            <p>By Frank Herbert</p>
          </div>
          <div class="book">
            <h3>The Hobbit</h3>
            <p>By J.R.R. Tolkien</p>
          </div>
        </section>
        <br />
        <section>
          <h2>Hours of Operation</h2>
          <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
          <p>Saturday: 10:00 AM – 4:00 PM</p>
          <p>Sunday: Closed</p>
        </section>
      </main>
      <footer>
        <address>
          Contact us: support@innoutbooks.com | (555) 123-4567
        </address>
      </footer>
    </div>
  </body>
  </html>
  `;
  res.send(html);
});

// GET endpoint that returns all books from the mock database
app.get("/api/books", async (req, res, next) => {
  try {
    // Retrieve all books using the mock database's find() method
    const allBooks = await books.find();
    console.log("All Books: ", allBooks); // Logs all books to the console
    res.send(allBooks); // Sends the books array back to the client
  } catch (err) {
    console.error("Error: ", err.message); // Logs the error message to the console
    next(err); // Passes the error to the next middleware (the error handler)
  }
});

// GET endpoint that returns a single book by id from the mock database
app.get("/api/books/:id", async (req, res, next) => {
  try {
    // Destructure the id from the route parameters
    let { id } = req.params;
    // Convert the id from a string to an integer
    id = parseInt(id);
    // If the id is not a valid number, pass a 400 error to the error handler
    if (isNaN(id)) {
      return next(createError(400, "Input must be a number"));
    }
    // Retrieve the book using the mock database's findOne() method
    const book = await books.findOne({ id: id });
    console.log("Book: ", book); // Logs the book to the console
    res.send(book); // Sends the book back to the client
  } catch (err) {
    console.error("Error: ", err.message); // Logs the error message to the console
    next(err); // Passes the error to the next middleware (the error handler)
  }
});

// POST endpoint that adds a new book to the mock database
app.post("/api/books", async (req, res, next) => {
  try {
    // Assign the request body (the new book) to a variable
    const newBook = req.body;
    // Check that the book has a title; if not, reject with a 400 error
    if (!newBook.title) {
      return next(createError(400, "Book title is required."));
    }
    // Insert the new book into the mock database using insertOne()
    const result = await books.insertOne(newBook);
    // Log the result for debugging purposes
    console.log("Result: ", result);
    // Send back a 201 status code along with the new book's id
    res.status(201).send({ id: result.ops[0].id });
  } catch (err) {
    // Log any errors that occur
    console.error("Error: ", err.message);
    // Pass the error to the error-handling middleware
    next(err);
  }
});

// DELETE endpoint that removes a book by id from the mock database
app.delete("/api/books/:id", async (req, res, next) => {
  try {
    // Destructure the id from the route parameters
    const { id } = req.params;
    // Call deleteOne() on the mock database, converting id to a number
    const result = await books.deleteOne({ id: parseInt(id) });
    // Log the result for debugging purposes
    console.log("Result: ", result);
    // Send back a 204 status code indicating successful deletion
    res.status(204).send();
  } catch (err) {
    // Log any errors that occur
    console.error("Error: ", err.message);
    // Pass the error to the error-handling middleware
    next(err);
  }
});

// 404 error handler - catches all unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// 500 error handler - catches all other errors
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

module.exports = app;