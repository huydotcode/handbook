import logger from '@/utils/logger';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

let isConnected = false; // Variable to track the connection status

const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if (!uri) {
        logger({
            message: "Missing URI",
            type: "error"
        })
        return;
    };

    if (isConnected) return;

    try {
        await mongoose.connect(uri);

        isConnected = true; 
    } catch (error) {
        logger({
            message: "Error connect to db" + error
        })
    }
};

export default connectToDB;
