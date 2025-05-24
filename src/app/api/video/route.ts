import { v2 as cloudinary } from 'cloudinary';
import { Image } from '@/models';
import { getAuthSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

// Tắt tự động xử lý body trong Next.js API route
export const config = {
    api: {
        bodyParser: false,
    },
};

// export async function POST(request: Request) {
//   try {
//     const session = await getAuthSession();
//     if (!session?.user) {
//       return new Response(null, { status: 401 });
//     }

//     // Parse multipart/form-data
//     const form = new IncomingForm();
//     const data = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
//       form.parse(request as any, (err, fields, files) => {
//         if (err) reject(err);
//         else resolve({ fields, files });
//       });
//     });

//     const videoFile = data.files.video[0]; // tên input="video" từ client
//     const fileData = await fs.readFile(videoFile.filepath);

//     // Upload video to Cloudinary
//     const uploadResult = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         { resource_type: 'video' },
//         (error, result) => {
//           if (error) return reject(error);
//           resolve(result);
//         }
//       ).end(fileData);
//     });

//     // Save metadata to DB
//     const newVideo = await new Video({
//       publicId: uploadResult.public_id,
//       width: uploadResult.width,
//       height: uploadResult.height,
//       resourceType: uploadResult.resource_type,
//       type: uploadResult.type,
//       url: uploadResult.secure_url,
//       duration: uploadResult.duration,
//       creator: session.user.id,
//     });

//     await newVideo.save();

//     return NextResponse.json(newVideo, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       {
//         message: 'Error when uploading video',
//         error,
//       },
//       { status: 500 }
//     );
//   }
// }
