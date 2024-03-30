//This file is our entry point for our express stuff
const app = require('../server').app;
const io = require('../server').io;

module.exports = app;
