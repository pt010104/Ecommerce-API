require('dotenv').config();
const { createClient } = require('redis');

const client = createClient({
    url: process.env.REDIS_URL
});

client.on('connect', () => {
    console.log('Redis client connected');
});

client.on('error', (error) => {
    console.error('Redis client error:', error);
});

(async () => {
    try {
        await client.connect();
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
})();

module.exports = client;