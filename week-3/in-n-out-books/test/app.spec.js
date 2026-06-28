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