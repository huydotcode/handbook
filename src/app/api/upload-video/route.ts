import { NextRequest, NextResponse } from 'next/server';

import { getAuthSession } from '@/lib/auth';
import { Media } from '@/models';
import connectToDB from '@/services/mongoose';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const session = await getAuthSession();

        if (!session?.user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Bạn cần đăng nhập để thực hiện hành động này',
                },
                { status: 401 }
            );
        }

        // Lấy form data
        const formData = await req.formData();

        // Lấy file video
        const video = formData.get('video');
        if (!video || !(video instanceof Blob)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Không tìm thấy file video hoặc file không hợp lệ',
                },
                { status: 400 }
            );
        }

        // Đọc Blob thành Buffer để upload lên Cloudinary
        const arrayBuffer = await video.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Cloudinary uploader có thể nhận Buffer thông qua upload_stream
        const uploadFromBuffer = (): Promise<any> =>
            new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'video',
                        folder: `handbook/videos/${session.user.id}`,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                stream.end(buffer);
            });

        const result = await uploadFromBuffer();

        if (!result || result.error) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Lỗi khi upload video lên Cloudinary',
                    error: result.error,
                },
                { status: 500 }
            );
        }

        // Lưu thông tin video vào DB (nếu cần)
        const newMedia = await Media.create({
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            resourceType: result.resource_type,
            type: result.type,
            url: result.secure_url,
            creator: session.user.id,
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Upload video thành công',
                data: newMedia,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Lỗi khi upload video',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
