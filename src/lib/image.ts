'use server';
import logger from '@/utils/logger';
import { getAuthSession } from './auth';
import { Image } from '@/models';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadImage = async ({ image }: { image: any }) => {
    logger({
        message: 'API: UPLOAD IMAGES',
        type: 'error',
    });
    const session = await getAuthSession();

    try {
        // const options = {
        //     use_filename: true,
        //     unique_filename: false,
        //     overwrite: true,
        // };
        // const result = await cloudinary.uploader.upload(image, options);
        // const newImage = await new Image({
        //     ...result,
        //     user_id: session?.user.id,
        // });
        // await newImage.save();
        // return JSON.parse(JSON.stringify(newImage));
    } catch (error) {
        return new Response('Failed to upload image on Cloudinary');
    }
};
