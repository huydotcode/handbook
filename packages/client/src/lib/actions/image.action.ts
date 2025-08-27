'use server';
import { getAuthSession } from '@/lib/auth';
import { Media } from '@/models';
import connectToDB from '@/services/mongoose';

export const getUrlByImageId = async ({ imageId }: { imageId: string }) => {
    console.log('[LIB-ACTIONS] getUrlByImageId');
    try {
        await connectToDB();
        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        const image = await Media.findById(imageId);
        return image?.url;
    } catch (error: any) {
        throw new Error('Error getUrlByImageId' + error);
    }
};

export const removeImage = async ({ imageUrl }: { imageUrl: string }) => {
    console.log('[LIB-ACTIONS] removeImage');
    try {
        await connectToDB();
        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        await Media.deleteOne({
            url: imageUrl,
        });

        return true;
    } catch (error: any) {
        throw new Error('Error removeImage' + error);
    }
};
