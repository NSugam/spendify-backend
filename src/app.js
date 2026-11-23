const express = require('express');
const cors = require('cors');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', require('./routes'));

// 404 Not Found
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;