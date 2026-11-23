const express = require('express');
const cors = require('cors');
require('./config/redis');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Spendify API 🚀',
        version: '1.0.0'
    });
});

// API routes
app.use('/api', require('./routes'));

// 404 Not Found
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;