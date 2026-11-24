require('dotenv').config();

const app = require('./app');
const connectDatabase = require('./config/database');

const PORT = process.env.PORT || 5000;

export const startConnections = async () => {
    await connectDatabase();

    app.listen(PORT, () => {
        console.log(`Spendify server running on port ${PORT}`);
    });
};