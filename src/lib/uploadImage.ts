import toast from 'react-hot-toast';
import axiosInstance from './axios';
import { API_ROUTES } from '@/config/api';

export const uploadImages = async ({
    photos,
}: {
    photos: string[];
}): Promise<string[]> => {
    const imagesUpload = photos.map((photo) => {
        return fetch(API_ROUTES.IMAGES.INDEX, {
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

            const response = await axiosInstance.post(
                API_ROUTES.UPLOAD.IMAGE,
                formDataImage,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message || 'Lỗi khi tải lên hình ảnh'
                );
            }

            return response.data.data;

        case 'video':
            const formDataVideo = new FormData();
            formDataVideo.append('video', file);
            const responseVideo = await axiosInstance.post(
                API_ROUTES.UPLOAD.VIDEO,
                formDataVideo,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (!responseVideo.data.success) {
                throw new Error(
                    responseVideo.data.message || 'Lỗi khi tải lên video'
                );
            }

            return responseVideo.data.data;

        default:
            throw new Error('Không hỗ trợ định dạng file này');
    }
};

export const uploadImagesWithFiles = async ({
    files,
}: {
    files: File[];
}): Promise<IMedia[]> => {
    const uploadTasks = Array.from(files || []).map(async (file) => {
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

                const response = await axiosInstance.post(
                    API_ROUTES.UPLOAD.IMAGE,
                    formDataImage,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                if (!response.data.success) {
                    throw new Error(
                        response.data.message || 'Lỗi khi tải lên hình ảnh'
                    );
                }

                return response.data.data;

            case 'video':
                if (files.length >= 5) {
                    toast.error('Bạn chỉ có thể tải lên tối đa 5 video!');
                    throw new Error('Vượt quá số lượng video cho phép');
                }

                const formDataVideo = new FormData();
                formDataVideo.append('video', file);
                const responseVideo = await axiosInstance.post(
                    API_ROUTES.UPLOAD.VIDEO,
                    formDataVideo,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                if (!responseVideo.data.success) {
                    throw new Error(
                        responseVideo.data.message || 'Lỗi khi tải lên video'
                    );
                }

                return responseVideo.data.data;

            default:
                throw new Error('Không hỗ trợ định dạng file này');
        }
    });

    const results = await Promise.all(uploadTasks);

    return results.filter(
        (result): result is IMedia => result !== undefined && result !== null
    );
};
