'use server';
import { getAuthSession } from '@/lib/auth';
import { Image } from '@/models';
import logger from '@/utils/logger';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

/*
    asset_id: 'e9f8721b5e3c6d9187fcfc83e6de478e',
    public_id: 'pqgwh3g8jao8nkyg0gev',
    version: 1710069270,
    version_id: '509dd1dddbe5dfa0ff4bdb3f27260dc7',
    width: 736,
    height: 920,
    resource_type: 'image',
    signature: '700de709c93c9189986b1484d76ed311f7955b31',
    created_at: '2024-03-10T11:14:30Z',
    tags: [],
    bytes: 45481,
    type: 'upload',
    etag: '0e8f9fa1b708253c7b3199531ee4581d',
    placeholder: false,
    url: 'http://res.cloudinary.com/da4pyhfyy/image/upload/v1710069270/pqgwh3g8jao8nkyg0gev.jpg',
    format: 'jpg',
    secure_url: 'https://res.cloudinary.com/da4pyhfyy/image/upload/v1710069270/pqgwh3g8jao8nkyg0gev.jpg',
    api_key: '533638155798775'
    folder: '',
*/

export async function uploadImage({ image }: { image: string }) {
    logger({
        message: 'LIB: uploadImages',
    });

    try {
        const session = await getAuthSession();

        if (!session) {
            throw new Error('Unauthorized');
        }

        const res = await cloudinary.uploader.upload(image, {
            // upload_preset: 'social-network',
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        });

        // Check
        if (!res) {
            throw new Error('Failed to upload image');
        }

        const newImage = new Image({
            publicId: res.public_id,
            width: res.width,
            height: res.height,
            resourceType: res.resource_type,
            type: res.type,
            url: res.url,
            creator: session.user.id,
        });

        await newImage.save();

        return JSON.parse(JSON.stringify(newImage)) as IImage;
    } catch (error: any) {
        throw new Error(error);
    }
}
