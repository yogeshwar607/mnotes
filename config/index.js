const express = require('./components/express');
const server = require('./components/server');
const database = require('./components/database');
const mongoose = require('./components/mongoose');
const logger = require('./components/logger');

module.exports = {
  server,
  database,
  express,
  mongoose,
  logger,
};