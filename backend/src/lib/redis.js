import { createClient } from 'redis';


const redis = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

redis.on('error', err => console.log('Redis client Error', err));

export async function connectRedis() {
    if (!redis.isOpen) {
      await redis.connect();
      console.log('Redis connected');
    }
  }


export default redis
