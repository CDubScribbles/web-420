/**
 * Author: Clifford Smith
 * Date: 06/21/2026
 * File Name: app.spec.js
 * Description: Test suite for the Cookbook App. Tests the findAll and
 *              findById endpoints using TDD principles with supertest.
 */
"use strict";
// Import the Express app instance to test against
const app = require("../src/app");
// Import supertest to send HTTP requests to the app without starting a server
const request = require("supertest");

describe("Chapter 3: API Tests", () => {
  // Test that the /api/recipes endpoint returns an array of recipe objects
  it("it should return an array of recipes", async () => {
    // Send a GET request to the /api/recipes endpoint and await the response
    const res = await request(app).get("/api/recipes");
    // Verify the response status code is 200 (OK)
    expect(res.statusCode).toEqual(200);
    // Verify the response body is an array
    expect(res.body).toBeInstanceOf(Array);
    // Verify each recipe in the array has the expected properties
    res.body.forEach((recipe) => {
      expect(recipe).toHaveProperty("id");
      expect(recipe).toHaveProperty("name");
      expect(recipe).toHaveProperty("ingredients");
    });
  });

  // Test that the /api/recipes/:id endpoint returns a single recipe by ID
  it("should return a single recipe", async () => {
    // Send a GET request to /api/recipes/1 and await the response
    const res = await request(app).get("/api/recipes/1");
    // Verify the response status code is 200 (OK)
    expect(res.statusCode).toEqual(200);
    // Verify the response body has the expected id, name, and ingredients
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("name", "Pancakes");
    expect(res.body).toHaveProperty("ingredients", ["flour", "milk", "eggs"]);
  });

  // Test that a 400 error is returned when the id parameter is not a number
  it("should return a 400 error if the id is not a number", async () => {
    // Send a GET request with a non-numeric id and await the response
    const res = await request(app).get("/api/recipes/foo");
    // Verify the response status code is 400 (Bad Request)
    expect(res.statusCode).toEqual(400);
    // Verify the error message explains the expected input
    expect(res.body.message).toEqual("Input must be a number");
  });
});