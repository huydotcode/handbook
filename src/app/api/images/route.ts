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

export async function POST(request: Request) {
    logger({
        message: 'API: UPLOAD IMAGES',
        type: 'error',
    });
    const { images, userId } = await request.json();
    const imagesResponse: any[] = [];

    try {
        const session = await getAuthSession();

        if (!session) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), {
                status: 401,
            });
        }

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
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                resourceType: result.resource_type,
                type: result.type,
                url: result.url,
                creator: session.user.id,
            });
            await image.save();

            imagesResponse.push(image);
        }

        return new Response(JSON.stringify(imagesResponse));
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
        });
    }
}

export async function DELETE(request: Request) {
    logger({
        message: 'API: DELETE IMAGES',
    });
    const { images }: { images: IImage[]; postId: string } =
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

            await cloudinary.uploader.destroy(img.publicId);
        }

        return new Response('Success to delete images', { status: 200 });
    } catch (error) {
        return new Response('Failed to delete image', {
            status: 500,
        });
    }
}
