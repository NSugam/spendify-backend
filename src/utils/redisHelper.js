const redis = require('../config/redis');

const redisHelper = {
    // Get cached data
    get: async (key) => {
        try {
            const data = await redis.get(key);

            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Redis GET error:', error.message);
            return null;
        }
    },

    // Set cached data
    set: async (key, value, expiry = 300) => {
        try {
            await redis.set(
                key,
                JSON.stringify(value),
                'EX',
                expiry
            );

            return true;
        } catch (error) {
            console.error('Redis SET error:', error.message);
            return false;
        }
    },

    // Delete cached data
    delete: async (key) => {
        try {
            await redis.del(key);
            return true;
        } catch (error) {
            console.error('Redis DELETE error:', error.message);
            return false;
        }
    }
};

module.exports = redisHelper;