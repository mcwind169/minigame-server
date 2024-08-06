
import express from 'express';
import Redis from 'ioredis';
import axios from 'axios';


const app = express();
const port = process.env.PORT || 3000;

// Create a Redis client
const redis = new Redis(6379, 'redis');

app.use(express.json());

app.post('/login', async (req, res) => {

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: 'kwaisyl6xcyuh6fu',
    client_secret: 'aef8b4bc45666b3a7d23579843615d3c7c26e2ec'
  });
  const rsp = await axios.post("https://game.kwai.com/openapi/oauth/token", params);

  console.log(rsp);

  res.json(rsp.data);
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