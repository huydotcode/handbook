import { v2 as cloudinary } from 'cloudinary';
import { Media } from '@/models';
import { getAuthSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

export async function POST(request: Request) {
    const { image } = await request.json();

    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new Response(null, {
                status: 401,
            });
        }

        const imageUpload = await cloudinary.uploader.upload(image);

        const newMedia = await new Media({
            publicId: imageUpload.public_id,
            width: imageUpload.width,
            height: imageUpload.height,
            resourceType: imageUpload.resource_type,
            type: imageUpload.type,
            url: imageUpload.secure_url,
            creator: session.user.id,
        });

        await newMedia.save();

        return NextResponse.json(newMedia, {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                message: 'Error when upload image',
                error,
            },
            {
                status: 500,
            }
        );
    }
}

export async function DELETE(request: Request) {
    const { publicId } = await request.json();

    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new Response('Chưa đăng nhập', {
                status: 401,
            });
        }

        const image = await Media.findOne({
            publicId,
            creator: session?.user.id,
        });

        if (!image) {
            return new Response(null, {
                status: 404,
            });
        }

        await cloudinary.uploader.destroy(publicId);

        await image.remove();

        return new Response(null, {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response('Error when delete images' + error, {
            status: 500,
        });
    }
}
