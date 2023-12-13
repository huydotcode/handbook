import { getAuthSession } from '@/lib/auth';
import Image from '@/models/Image';
import logger from '@/utils/logger';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

// https://res.cloudinary.com/da4pyhfyy/image/upload/v1692534041/lbcdrwwil4xhesbvctv8.jpg

export async function POST(request: Request) {
    logger('API: UPLOAD IMAGES');
    const session = await getAuthSession();
    const images = await request.json();

    const imagesUrl: any[] = [];
    try {
        for (const img of images) {
            if (!img) {
                return new Response(
                    JSON.stringify({ message: 'Image path is required' }),
                    {
                        status: 400,
                    }
                );
            }

            const options = {
                use_filename: true,
                unique_filename: false,
                overwrite: true,
            };
            const result = await cloudinary.uploader.upload(img, options);

            const image = await new Image({
                ...result,
                user_id: session?.user.id,
            });
            await image.save();

            imagesUrl.push(result);
        }

        return new Response(JSON.stringify(imagesUrl));
    } catch (error) {
        return new Response('Failed to upload image on Cloudinary');
    }
}

export async function DELETE(request: Request) {
    logger('API: DELETE IMAGES');
    const { images }: { images: CloudinaryImage[]; postId: string } =
        await request.json();

    try {
        for (const img of images) {
            if (!img) {
                return new Response(
                    JSON.stringify({ message: 'Image invalid' }),
                    {
                        status: 400,
                    }
                );
            }

            await cloudinary.uploader.destroy(img.public_id);
        }

        return new Response('Success to delete images', { status: 200 });
    } catch (error) {
        return new Response('Failed to delete image', {
            status: 500,
        });
    }
}
