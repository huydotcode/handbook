import dotenv from 'dotenv';
dotenv.config();

import { NextFunction, Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { jwt } from '../utils/jwt';
import Media from '../models/media.model';
import { JwtPayload } from 'jsonwebtoken';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

class UploadController {
    public async uploadImage(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const image = req.file;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const decodedToken: JwtPayload = jwt.verify(token);
            if (!decodedToken || !decodedToken.id) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token',
                });
            }

            console.log('Decoded Token:', decodedToken);

            if (!image) {
                return res.status(400).json({
                    success: false,
                    message: 'No image file provided',
                });
            }

            const arrayBuffer = await image.buffer;
            const buffer = Buffer.from(arrayBuffer);

            // Upload lên Cloudinary bằng stream
            const uploadResult = (await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: `handbook/images/${decodedToken.id}`,
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
                creator: decodedToken.id,
            });

            await newMedia.save();

            return res.status(200).json({
                success: true,
                data: newMedia,
            });
        } catch (error) {
            console.error('Error uploading image:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to upload image',
            });
        }
    }

    public async uploadVideo(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const video = req.file;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const decodedToken: JwtPayload = jwt.verify(token);
            if (!decodedToken || !decodedToken.id) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token',
                });
            }

            console.log('Decoded Token:', decodedToken);

            if (!video) {
                return res.status(400).json({
                    success: false,
                    message: 'No video file provided',
                });
            }

            const arrayBuffer = await video.buffer;
            const buffer = Buffer.from(arrayBuffer);

            // Upload lên Cloudinary bằng stream
            const uploadResult = (await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'video',
                        folder: `handbook/videos/${decodedToken.id}`,
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
                creator: decodedToken.id,
            });

            await newMedia.save();

            return res.status(200).json({
                success: true,
                data: newMedia,
            });
        } catch (error) {
            console.error('Error uploading video:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to upload video',
            });
        }
    }
}

export default new UploadController();
