import { getUrlByImageId, removeImage } from '../actions/image.action';

interface IImageService {
    getUrlByImageId: (imageId: string) => Promise<string | null>;
    removeImage: (imageUrl: string) => Promise<boolean>;
}

class ImageServiceClass implements IImageService {
    async getUrlByImageId(imageId: string): Promise<string | null> {
        console.log('[LIB-SERVICES] getUrlByImageId');
        const url = await getUrlByImageId({ imageId });
        if (!url) {
            throw new Error('Image not found');
        }

        return url;
    }

    async removeImage(imageUrl: string): Promise<boolean> {
        console.log('[LIB-SERVICES] removeImage');
        const result = await removeImage({
            imageUrl,
        });

        if (!result) {
            throw new Error('Failed to remove image');
        }

        return result;
    }
}

const ImageService = new ImageServiceClass();
export default ImageService;
