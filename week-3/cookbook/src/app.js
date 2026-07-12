/**
 * Author: Clifford Smith
 * Date: 06/14/2026
 * File Name: app.js
 * Description: Express application for the Cookbook App project. Sets up
 *              the server, landing page route, recipes API route, and
 *              error handling middleware.
 */
"use strict";

// Import Express to create the application and define routes
const express = require("express");
// Import bcryptjs for future password hashing functionality
const bcrypt = require("bcryptjs");
// Import http-errors to create standardized HTTP error objects
const createError = require("http-errors");
// Import the mock database module containing recipe data
const recipes = require("../database/recipes");

// Create the Express application instance
const app = express();

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());
// Middleware to parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// GET route for the root URL - displays the Cookbook App landing page
app.get("/", async (req, res, next) => {
  const html = `
  <html>
  <head>
    <title>Cookbook App</title>
    <style>
      body, h1, h2, h3 { margin: 0; padding: 0; border: 0;}
      body {
        background: #424242;
        color: #fff;
        margin: 1.25rem;
        font-size: 1.25rem;
      }
      h1, h2, h3 { color: #EF5350; font-family: 'Emblema One', cursive;}
      h1, h2 { text-align: center }
      h3 { color: #fff; }
      .container { width: 50%; margin: 0 auto; font-family: 'Lora', serif; }
      .recipe { border: 1px solid #EF5350; padding: 1rem; margin: 1rem 0; }
      .recipe h3 { margin-top: 0; }
      main a { color: #fff; text-decoration: none; }
      main a:hover { color: #EF5350; text-decoration: underline;}
    </style>
  </head>
  <body>
    <div class="container">
      <header>
        <h1>Cookbook App</h1>
        <h2>Discover and Share Amazing Recipes</h2>
      </header>
      <br />
      <main>
        <div class="recipe">
          <h3>Classic Beef Tacos</h3>
          <p>1. Brown the ground beef in a skillet.<br>2. Warm the taco shells in the oven.<br>3. Fill the taco shells with beef, lettuce, and cheese.</p>
        </div>
        <div class="recipe">
          <h3>Vegetarian Lasagna</h3>
          <p>1. Layer lasagna noodles, marinara sauce, and cheese in a baking dish.<br>2. Bake at 375 degrees for 45 minutes.<br>3. Let cool before serving.</p>
        </div>
      </main>
    </div>
  </body>
  </html>
  `;
  res.send(html);
});

// GET endpoint that returns all recipes from the mock database
app.get("/api/recipes", async (req, res, next) => {
  try {
    // Retrieve all recipes using the mock database's find() method
    const allRecipes = await recipes.find();
    console.log("All Recipes: ", allRecipes); // Logs all recipes to the console
    res.send(allRecipes); // Sends the recipes array back to the client
  } catch (err) {
    console.error("Error: ", err.message); // Logs the error message to the console
    next(err); // Passes the error to the next middleware (the error handler)
  }
});

// GET endpoint that returns a single recipe by id from the mock database
app.get("/api/recipes/:id", async (req, res, next) => {
  try {
    // Destructure the id from the route parameters
    let { id } = req.params;
    // Convert the id from a string to an integer
    id = parseInt(id);
    // If the id is not a valid number, pass a 400 error to the error handler
    if (isNaN(id)) {
      return next(createError(400, "Input must be a number"));
    }
    // Retrieve the recipe using the mock database's findOne() method
    const recipe = await recipes.findOne({ id: Number(req.params.id) });
    console.log("Recipe: ", recipe); // Logs the recipe to the console
    res.send(recipe); // Sends the recipe back to the client
  } catch (err) {
    console.error("Error: ", err.message); // Logs the error message to the console
    next(err); // Passes the error to the next middleware (the error handler)
  }
});

// POST endpoint that adds a new recipe to the mock database
app.post("/api/recipes", async (req, res, next) => {
  try {
    // Assign the request body (the new recipe) to a variable
    const newRecipe = req.body;
    // Define the only fields a valid recipe object is allowed to have
    const expectedKeys = ["id", "name", "ingredients"];
    // Get the actual fields sent in the request body
    const receivedKeys = Object.keys(newRecipe);
    // Check if the received fields don't match the expected fields exactly
    if (!receivedKeys.every((key) => expectedKeys.includes(key)) || receivedKeys.length !== expectedKeys.length) {
      // Reject the request with a 400 error if the shape doesn't match
      return next(createError(400, "Bad Request"));
    }
    // Insert the new recipe into the mock database using insertOne()
    const result = await recipes.insertOne(newRecipe);
    // Log the result for debugging purposes
    console.log("Result: ", result);
    // Send back a 201 status code along with the new recipe's id
    res.status(201).send({ id: result.ops[0].id });
  } catch (err) {
    // Log any errors that occur
    console.error("Error: ", err.message);
    // Pass the error to the error-handling middleware
    next(err);
  }
});

// DELETE endpoint that removes a recipe by id from the mock database
app.delete("/api/recipes/:id", async (req, res, next) => {
  try {
    // Destructure the id from the route parameters
    const { id } = req.params;
    // Call deleteOne() on the mock database, converting id to a number
    const result = await recipes.deleteOne({ id: parseInt(id) });
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

// PUT endpoint that updates an existing recipe by id in the mock database
app.put("/api/recipes/:id", async (req, res, next) => {
  try {
    // Destructure the id from the route parameters
    let { id } = req.params;
    // Assign the request body (the updated recipe fields) to a variable
    let recipe = req.body;
    // Convert the id from a string to an integer
    id = parseInt(id);
    // If the id is not a valid number, respond with a 400 error
    if (isNaN(id)) {
      return next(createError(400, "Input must be a number"));
    }
    // Define the only fields a valid recipe object is allowed to have
    const expectedKeys = ["name", "ingredients"];
    // Get the actual fields sent in the request body
    const receivedKeys = Object.keys(recipe);
    // Check if the received fields don't match the expected fields exactly
    if (!receivedKeys.every(key => expectedKeys.includes(key)) || receivedKeys.length !== expectedKeys.length) {
      // Log the mismatch for debugging purposes
      console.error("Bad Request: Missing keys or extra keys", receivedKeys);
      // Reject the request with a 400 error if the shape doesn't match
      return next(createError(400, "Bad Request"));
    }
    // Call updateOne() on the mock database, matching by id and applying the new fields
    const result = await recipes.updateOne({ id: id }, recipe);
    // Log the result for debugging purposes
    console.log("Result: ", result);
    // Send back a 204 status code indicating successful update
    res.status(204).send();
  } catch (err) {
    // If updateOne() couldn't find a matching recipe, respond with a 404
    if (err.message === "No matching item found") {
      console.log("Recipe not found", err.message)
      return next(createError(404, "Recipe not found"));
    }
    // Log any other unexpected errors
    console.error("Error: ", err.message);
    // Pass the error to the error-handling middleware
    next(err);
  }
});

// 404 error handler - catches all unmatched routes
app.use((req, res, next) => {
  next(createError(404));
});

// 500 error handler - catches all other errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

module.exports = app;