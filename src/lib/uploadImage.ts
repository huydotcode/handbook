import toast from 'react-hot-toast';
import { convertFileToBase64 } from '@/lib/convertFileToBase64';

export const uploadImages = async ({
    photos,
}: {
    photos: string[];
}): Promise<string[]> => {
    const imagesUpload = photos.map((photo) => {
        return fetch('/api/images', {
            method: 'POST',
            body: JSON.stringify({ image: photo }),
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => res.json().then((data: IImage) => data._id as string));
    });

    const results = await Promise.allSettled(imagesUpload);
    return results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<string>).value);
};

export const uploadImagesWithFiles = async ({
    files,
}: {
    files: File[];
}): Promise<string[]> => {
    const imagesUpload = files.map(async (file) => {
        const base64 = await convertFileToBase64(file);
        return fetch('/api/images', {
            method: 'POST',
            body: JSON.stringify({ image: base64 }),
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => res.json().then((data: IImage) => data._id as string));
    });

    const results = await Promise.allSettled(imagesUpload);
    return results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<string>).value);
};
