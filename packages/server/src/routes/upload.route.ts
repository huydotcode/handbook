import { Router } from 'express';
import uploadController from '../controllers/upload.controller';
import {
    multerImageMiddleware,
    multerVideoMiddleware,
} from '../middlewares/multer.middleware';

const uploadRouter = Router();

uploadRouter.post(
    '/image',
    multerImageMiddleware,
    uploadController.uploadImage
);
uploadRouter.post(
    '/video',
    multerVideoMiddleware,
    uploadController.uploadVideo
);

export default uploadRouter;
