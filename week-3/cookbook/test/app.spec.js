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

describe("Chapter 4: API Tests", () => {
  // Test that the /api/recipes endpoint returns a 201 status when a new recipe is added
  it("should return a 201 status code when adding a new recipe", async () => {
    // Send a POST request to /api/recipes with a new recipe object and await the response
    const res = await request(app).post("/api/recipes").send({
      id: 99,
      name: "Grilled Cheese",
      ingredients: ["bread", "cheese", "butter"],
    });
    // Verify the response status code is 201 (Created)
    expect(res.statusCode).toEqual(201);
  });

  // Test that adding a recipe with invalid or extra fields returns a 400 error
  it("should return a 400 status code when adding a new recipe with missing or extra fields", async () => {
    // Send a POST request with an object that doesn't match the expected recipe shape
    const res = await request(app).post("/api/recipes").send({
      invalidField: "invalidFieldValue",
    });
    // Verify the response status code is 400 (Bad Request)
    expect(res.statusCode).toEqual(400);
    // Verify the error message
    expect(res.body.message).toEqual("Bad Request");
  });

  // Test that deleting an existing recipe returns a 204 status code
  it("should return a 204 status code when deleting a recipe", async () => {
    // Send a DELETE request to /api/recipes/99 and await the response
    const res = await request(app).delete("/api/recipes/99");
    // Verify the response status code is 204 (No Content)
    expect(res.statusCode).toEqual(204);
  });
});

describe("Chapter 5: API Tests", () => {
  // Test that a recipe is successfully updated and a 204 status is returned
  it("should return a 204 status code when updating a recipe", async () => {
    // Send a PUT request with updated recipe fields and await the response
    const res = await request(app).put("/api/recipes/1").send({
      name: "Pancakes",
      ingredients: ["flour", "milk", "eggs", "sugar"],
    });
    // Verify the response status code is 204 (No Content)
    expect(res.statusCode).toEqual(204);
  });

  // Test that a non-numeric id returns a 400 error instead of a 404
  it("should return a 400 status code when updating a recipe with a non-numeric id", async () => {
    // Send a PUT request with a non-numeric id and await the response
    const res = await request(app).put("/api/recipes/foo").send({
      name: "Test Recipe",
      ingredients: ["test", "test"],
    });
    // Verify the response status code is 400 (Bad Request)
      expect(res.statusCode).toEqual(400);
    // Verify the error message explains the expected input
      expect(res.body.message).toEqual("Input must be a number");
  });

  // Test that updating a recipe with missing keys or extra keys returns a 400 error
  it("should return a 400 status code when updating a recipe with missing keys or extra keys", async () => {
    // Send a PUT request with only a name field, missing the required ingredients field
    const res = await request(app).put("/api/recipes/1").send({
      name: "Test Recipe"
    });
    // Verify the response status code is 400 (Bad Request)
    expect(res.statusCode).toEqual(400);
    // Verify the error message
    expect(res.body.message).toEqual("Bad Request");

    // Send a second PUT request with a valid shape plus one extra, unexpected field
    const res2 = await request(app).put("/api/recipes/1").send({
      name: "Test Recipe",
      ingredients: ["test", "test"],
      extraKey: "extra"
    });
    // Verify the second response status code is also 400 (Bad Request)
    expect(res2.statusCode).toEqual(400);
    // Verify the error message is the same for this scenario
    expect(res2.body.message).toEqual("Bad Request");
  });
});