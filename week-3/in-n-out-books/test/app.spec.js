/**
 * Author: Clifford Smith
 * Date: 06/21/2026
 * File Name: app.spec.js
 * Description: Test suite for the In-N-Out-Books application. Tests the
 *              findAll and findById endpoints using TDD principles with
 *              supertest, including validation for non-numeric ids.
 */
"use strict";
// Import the Express app instance to test against
const app = require("../src/app");
// Import supertest to send HTTP requests to the app without starting a server
const request = require("supertest");

describe("Chapter 3: API Tests", () => {
  // Test that the /api/books endpoint returns an array of book objects
  it("should return an array of books", async () => {
    // Send a GET request to the /api/books endpoint and await the response
    const res = await request(app).get("/api/books");
    // Verify the response status code is 200 (OK)
    expect(res.statusCode).toEqual(200);
    // Verify the response body is an array
    expect(res.body).toBeInstanceOf(Array);
  });

  // Test that the /api/books/:id endpoint returns a single book by id
  it("should return a single book", async () => {
    // Send a GET request to /api/books/1 and await the response
    const res = await request(app).get("/api/books/1");
    // Verify the response status code is 200 (OK)
    expect(res.statusCode).toEqual(200);
    // Verify the response body has the expected id, title, and author
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("title", "The Fellowship of the Ring");
    expect(res.body).toHaveProperty("author", "J.R.R. Tolkien");
  });

  // Test that a 400 error is returned when the id parameter is not a number
  it("should return a 400 error if the id is not a number", async () => {
    // Send a GET request with a non-numeric id and await the response
    const res = await request(app).get("/api/books/foo");
    // Verify the response status code is 400 (Bad Request)
    expect(res.statusCode).toEqual(400);
    // Verify the error message explains the expected input
    expect(res.body.message).toEqual("Input must be a number");
  });
});

describe("Chapter 4: API Tests", () => {
  // Test that a new book is successfully added and a 201 status is returned
  it("should return a 201-status code when adding a new book", async () => {
    // Send a POST request with a complete book object and await the response
    const res = await request(app).post("/api/books").send({
      id: 99,
      title: "The Two Towers",
      author: "J.R.R. Tolkien",
    });
    // Verify the response status code is 201 (Created)
    expect(res.statusCode).toEqual(201);
  });

  // Test that adding a book without a title returns a 400 error
  it("should return a 400-status code when adding a new book with missing title", async () => {
    // Send a POST request that omits the required title field
    const res = await request(app).post("/api/books").send({
      id: 100,
      author: "J.R.R. Tolkien",
    });
    // Verify the response status code is 400 (Bad Request)
    expect(res.statusCode).toEqual(400);
    // Verify the error message explains what's missing
    expect(res.body.message).toEqual("Book title is required.");
  });

  // Test that deleting an existing book returns a 204 status
  it("should return a 204-status code when deleting a book", async () => {
    // Send a DELETE request for book id 1 and await the response
    const res = await request(app).delete("/api/books/1");
    // Verify the response status code is 204 (No Content)
    expect(res.statusCode).toEqual(204);
  });
});

describe("Chapter 5: API Tests", () => {
  // Test that a book is successfully updated and a 204 status is returned
  it("should update a book and return a 204-status code", async () => {
    // Send a PUT request with updated book fields and await the response
    const res = await request(app).put("/api/books/2").send({
      title: "The Fellowship of the Ring",
      author: "J.R.R. Tolkien",
    });
    // Verify the response status code is 204 (No Content)
    expect(res.statusCode).toEqual(204);
  });

  // Test that a non-numeric id returns a 400 error
  it("should return a 400-status code when using a non-numeric id", async () => {
    // Send a PUT request with a non-numeric id and await the response
    const res = await request(app).put("/api/books/foo").send({
      title: "Test Book",
      author: "Test Author",
    });
    // Verify the response status code is 400 (Bad Request)
    expect(res.statusCode).toEqual(400);
    // Verify the error message explains the expected input
    expect(res.body.message).toEqual("Input must be a number");
  });

  // Test that updating a book with a missing title returns a 400 error
  it("should return a 400-status code when updating a book with a missing title", async () => {
    // Send a PUT request that omits the required title field
    const res = await request(app).put("/api/books/1").send({
      author: "Test Author",
    });
    // Verify the response status code is 400 (Bad Request)
    expect(res.statusCode).toEqual(400);
    // Verify the error message explains what's missing
    expect(res.body.message).toEqual("Bad Request");
  });
});