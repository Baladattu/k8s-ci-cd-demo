const express = require('express');
const redis = require('redis');
const app = express();

app.use(express.json());

// Redis Configuration from environment variables
const redisUrl = process.env.REDIS_URL || 'redis://redis-service:6379';
const client = redis.createClient({ url: redisUrl });

client.on('error', (err) => console.log('Redis Client Error', err));

// Connect to Redis
async function connectRedis() {
  try {
    await client.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Could not connect to Redis', err);
  }
}
connectRedis();

app.get('/', (req, res) => {
  res.send('Hello from Kubernetes CI/CD Demo! v2 with Redis');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Store data in Redis
app.post('/data', async (req, res) => {
  const { key, value } = req.body;
  if (!key || !value) {
    return res.status(400).send('Key and value are required');
  }
  await client.set(key, value);
  res.status(201).send(`Stored ${key} = ${value}`);
});

// Retrieve data from Redis
app.get('/data/:key', async (req, res) => {
  const { key } = req.params;
  const value = await client.get(key);
  if (!value) {
    return res.status(404).send('Not found');
  }
  res.json({ key, value });
});

module.exports = app;
