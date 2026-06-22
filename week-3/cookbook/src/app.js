/**
 * Author: Clifford Smith
 * Date: 06/14/2026
 * File Name: app.js
 * Description: Express application for the Cookbook App project. Sets up
 *              the server, landing page route, and error handling middleware.
 */
"use strict";

const express = require("express");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");

const app = express();

app.use(express.json());
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