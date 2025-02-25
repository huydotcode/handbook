'use server';
import { getAuthSession } from '@/lib/auth';
import { Image } from '@/models';
import connectToDB from '@/services/mongoose';

export const getUrlByImageId = async ({ imageId }: { imageId: string }) => {
    try {
        await connectToDB();
        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        const image = await Image.findById(imageId);
        return image?.url;
    } catch (error: any) {
        throw new Error('Error getUrlByImageId' + error);
    }
};

export const removeImage = async ({ imageUrl }: { imageUrl: string }) => {
    try {
        await connectToDB();
        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        await Image.deleteOne({
            url: imageUrl,
        });

        return true;
    } catch (error: any) {
        throw new Error('Error removeImage' + error);
    }
};
