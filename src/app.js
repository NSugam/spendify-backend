require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./config/redis');
const connectDatabase = require('./config/database');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const app = express();
let databaseConnection;

const ensureDatabaseConnection = () => {
    if (!databaseConnection) {
        databaseConnection = connectDatabase().catch((error) => {
            databaseConnection = null;
            throw error;
        });
    }

    return databaseConnection;
};

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(async (req, res, next) => {
    try {
        await ensureDatabaseConnection();
        next();
    } catch (error) {
        next(error);
    }
});

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

// Startup function
const startServer = async () => {
    try {
        await ensureDatabaseConnection();

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Spendify server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
};

// Local development
if (require.main === module) {
    startServer();
}

module.exports = app;
module.exports.startServer = startServer;