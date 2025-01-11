'use realtime-server';
import { Image } from '@/models';
import logger from '@/utils/logger';

export const fetchAllPhotos = async () => {
    try {
        const images = await Image.find().sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(images));
    } catch (error) {
        logger({
            message: 'Error fetch all photos' + error,
            type: 'error',
        });
    }
};
