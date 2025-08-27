import logger from '@/utils/logger';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

let isConnected = false; // Variable to track the connection status

const connectToDB = async () => {
    mongoose.set('strictQuery', true);
    mongoose.set('bufferCommands', false);

    if (!uri) {
        logger({
            message: 'Missing URI',
            type: 'error',
        });
        return;
    }

    if (isConnected) return;

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            autoIndex: false,
        });

        isConnected = true;
    } catch (error: any) {
        throw new Error(error);
    }
};

export default connectToDB;
