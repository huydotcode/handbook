import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

const port = process.env.PORT || 8080;

const isDevelopmentEnv = process.env.NODE_ENV == 'development';

export const config = {
    mongodbUri: process.env.MONGODB_URI,
    redisHost: process.env.REDIS_HOST,
    redisPort: parseInt(process.env.REDIS_PORT || "6379"),
    redisPassword: process.env.REDIS_PASSWORD,
    port,
};
