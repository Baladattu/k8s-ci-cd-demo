const redis = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://redis-service:6379';
const client = redis.createClient({ url: redisUrl });

client.on('error', (err) => console.log('Redis Client Error', err));

async function connect() {
    if (!client.isOpen) {
        await client.connect();
        console.log('Connected to Redis for URL Shortener');
    }
}

connect();

// Keys Prefix
const URL_PREFIX = 'url:';
const USER_PREFIX = 'user:';
const ANALYTICS_PREFIX = 'analytics:';

// URL Methods
async function saveUrl(code, urlData) {
    await client.set(`${URL_PREFIX}${code}`, JSON.stringify(urlData));
}

async function getUrl(code) {
    const data = await client.get(`${URL_PREFIX}${code}`);
    return data ? JSON.parse(data) : null;
}

async function getUserUrls(userId) {
    const keys = await client.keys(`${URL_PREFIX}*`);
    const urls = [];
    for (const key of keys) {
        const data = await client.get(key);
        const url = JSON.parse(data);
        if (url.userId === userId) {
            urls.push({ ...url, code: key.replace(URL_PREFIX, '') });
        }
    }
    return urls;
}

// User Methods
async function saveUser(username, userData) {
    await client.set(`${USER_PREFIX}${username}`, JSON.stringify(userData));
}

async function getUser(username) {
    const data = await client.get(`${USER_PREFIX}${username}`);
    return data ? JSON.parse(data) : null;
}

// Analytics Methods
async function trackClick(code) {
    await client.incr(`${ANALYTICS_PREFIX}${code}`);
}

async function getStats(code) {
    const clicks = await client.get(`${ANALYTICS_PREFIX}${code}`);
    return { clicks: parseInt(clicks || 0) };
}

module.exports = {
    saveUrl,
    getUrl,
    getUserUrls,
    saveUser,
    getUser,
    trackClick,
    getStats
};
