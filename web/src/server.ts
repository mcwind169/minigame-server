
import express from 'express';
import Redis from 'ioredis';

const app = express();
const port = process.env.PORT || 3000;

// Create a Redis client
const redis = new Redis(6379,'redis');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Redis with Express.js and TypeScript!');
});

// Example of caching data
app.get('/cache', async (req, res) => {
  const cachedData = await redis.get('cachedData');

  if (cachedData) {
    // If data exists in the cache, return it
    res.send(JSON.parse(cachedData));
  } else {
    // If data is not in the cache, fetch it from the source
    const dataToCache = { message: 'Data to be cached' };
    await redis.set('cachedData', JSON.stringify(dataToCache), 'EX', 6); // Cache for 1 hour
    res.send('no cache found, create new...');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});