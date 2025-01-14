import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

const port = process.env.PORT || 8080;

export const config = {
    mongodbUri: process.env.MONGODB_URI,
    port,
};
