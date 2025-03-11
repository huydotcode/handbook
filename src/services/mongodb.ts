import mongoose from 'mongoose';
import { config } from '../utils/config';

let isConnected = false;

export const connectToMongo = async () => {
    if (isConnected) return;

    try {
        if (!config.mongodbUri) {
            throw new Error('MongoDB URI is not defined');
        }

        await mongoose.connect(config.mongodbUri, {
            autoCreate: true,
            autoIndex: true,
        });
        console.log('Connected to MongoDB');

        isConnected = true;
    } catch (error: any) {
        console.error('Error connecting to MongoDB:', error.message);

        isConnected = false;
    }
};
