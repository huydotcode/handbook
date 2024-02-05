'use server';

import { Image } from '@/models';

export const fetchAllPhotos = async () => {
    try {
        const images = await Image.find().sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(images));
    } catch (error) {
        console.log('Error fetching images:', error);
    }
};
