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
        }).then((res) => res.json().then((data: IMedia) => data._id as string));
    });

    const results = await Promise.allSettled(imagesUpload);
    return results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<string>).value);
};

export const uploadImageWithFile = async ({
    file,
}: {
    file: File;
}): Promise<IMedia> => {
    if (file.size > 100 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 100MB!');
        throw new Error('File quá lớn');
    }

    const type = file.type.split('/')[0];

    switch (type) {
        case 'image':
            const formDataImage = new FormData();
            formDataImage.append('image', file);
            const responseImage = await fetch('/api/upload/image', {
                method: 'POST',
                body: formDataImage,
            });

            if (!responseImage.ok) {
                const errorData = await responseImage.json();
                throw new Error(
                    errorData.message || 'Lỗi khi tải lên hình ảnh'
                );
            }

            const resultImage = await responseImage.json();
            if (!resultImage.success) {
                throw new Error(
                    resultImage.message || 'Lỗi khi tải lên hình ảnh'
                );
            }

            return resultImage.data;

        case 'video':
            const formDataVideo = new FormData();
            formDataVideo.append('video', file);

            const responseVideo = await fetch('/api/upload/video', {
                method: 'POST',
                body: formDataVideo,
            });

            if (!responseVideo.ok) {
                const errorData = await responseVideo.json();
                throw new Error(errorData.message || 'Lỗi khi tải lên video');
            }

            const resultVideo = await responseVideo.json();
            if (!resultVideo.success) {
                throw new Error(resultVideo.message || 'Lỗi khi tải lên video');
            }

            return resultVideo.data;

        default:
            throw new Error('Không hỗ trợ định dạng file này');
    }
};

export const uploadImagesWithFiles = async ({
    files,
}: {
    files: File[];
}): Promise<IMedia[]> => {
    const uploadTasks = Array.from(files).map(async (file) => {
        if (file.size > 100 * 1024 * 1024) {
            toast.error('Kích thước file không được vượt quá 100MB!');
            throw new Error('File quá lớn');
        }

        const type = file.type.split('/')[0];

        switch (type) {
            case 'image':
                if (files.length >= 10) {
                    toast.error('Bạn chỉ có thể tải lên tối đa 10 hình ảnh!');
                    throw new Error('Vượt quá số lượng ảnh cho phép');
                }

                const formDataImage = new FormData();
                formDataImage.append('image', file);
                const responseImage = await fetch('/api/upload-image', {
                    method: 'POST',
                    body: formDataImage,
                });

                if (!responseImage.ok) {
                    const errorData = await responseImage.json();
                    throw new Error(
                        errorData.message || 'Lỗi khi tải lên hình ảnh'
                    );
                }

                const resultImage = await responseImage.json();
                if (!resultImage.success) {
                    throw new Error(
                        resultImage.message || 'Lỗi khi tải lên hình ảnh'
                    );
                }

                return resultImage.data;

            case 'video':
                const formDataVideo = new FormData();
                formDataVideo.append('video', file);

                const responseVideo = await fetch('/api/upload-video', {
                    method: 'POST',
                    body: formDataVideo,
                });

                if (!responseVideo.ok) {
                    const errorData = await responseVideo.json();
                    throw new Error(
                        errorData.message || 'Lỗi khi tải lên video'
                    );
                }

                const resultVideo = await responseVideo.json();
                if (!resultVideo.success) {
                    throw new Error(
                        resultVideo.message || 'Lỗi khi tải lên video'
                    );
                }

                return resultVideo.data;

            default:
                throw new Error('Không hỗ trợ định dạng file này');
        }
    });

    const results = await Promise.all(uploadTasks);

    return results.filter(
        (result): result is IMedia => result !== undefined && result !== null
    );
};
