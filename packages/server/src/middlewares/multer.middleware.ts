import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const multerImageMiddleware = upload.single('image');
export const multerVideoMiddleware = upload.single('video');
