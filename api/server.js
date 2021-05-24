const express = require("express");

const server = express();

server.use(express.json());

const authRouter = require("./auth/auth-router.js");

server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Welcome to Secret Recipes Backend!</h2>`);
});

module.exports = server;