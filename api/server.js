const express = require("express");

const server = express();

server.use(express.json());

const { restricted } = require('./auth/auth-middleware');

const authRouter = require("./auth/auth-router.js");
const recipesRouter = require("./recipes/recipes-router.js");

server.use('/api/auth', authRouter);
server.use('/api/recipes', restricted, recipesRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Welcome to Secret Recipes Backend!</h2>`);
});

module.exports = server;