import { getAuthSession } from '@/lib/auth';
import { Media } from '@/models';
import connectToDB from '@/services/mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

export async function POST(request: Request) {
    try {
        await connectToDB();
        const session = await getAuthSession();

        if (!session?.user) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Lấy FormData từ request
        const formData = await request.formData();
        const image = formData.get('image');

        if (!image || !(image instanceof Blob)) {
            return NextResponse.json(
                { success: false, message: 'No valid image file provided' },
                { status: 400 }
            );
        }

        // Chuyển Blob sang Buffer
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload lên Cloudinary bằng stream
        const uploadResult = (await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: `handbook/images/${session.user.id}`,
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            uploadStream.end(buffer);
        })) as any;

        const newMedia = new Media({
            publicId: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height,
            resourceType: uploadResult.resource_type,
            type: uploadResult.format,
            url: uploadResult.secure_url,
            creator: session.user.id,
        });

        // Lưu vào MongoDB
        await newMedia.save();

        return NextResponse.json({
            success: true,
            message: 'Image uploaded successfully',
            data: newMedia,
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error uploading image',
                error: error.message,
            },
            { status: 500 }
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
