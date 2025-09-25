require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        url: process.env.DATABASE_URL || 'mongodb://localhost:27017/house_draw'
    },
    session: {
        secret: process.env.SESSION_SECRET || 'your-secret-key'
    }
};

module.exports = config;