const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
        return Math.min(times * 100, 3000);
    }
});

redis.on('connect', () => {
    console.log('Redis connected successfully');
});

redis.on('error', (error) => {
    console.error('Redis connection error:', error.message);
});

module.exports = redis;