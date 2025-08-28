import Redis from 'ioredis';
import { config } from '../utils/config';

const port = process.env.REDIS_PORT || "6379";

const redis = new Redis({
  host: config.redisHost,
  port: config.redisPort,
  password: config.redisPassword,
});

export default redis;