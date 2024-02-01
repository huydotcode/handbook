'use server';
import { Image, Profile, User } from '@/models';
import connectToDB from '@/services/mongoose';
import { revalidatePath } from 'next/cache';
import { getAuthSession } from '../auth';

export const changeBioAction = async ({
    newBio,
    path,
    userId,
}: {
    userId: string;
    newBio: any;
    path: string;
}) => {
    try {
        await connectToDB();
        await Profile.updateOne({ userId: userId }, { bio: newBio });
    } catch (error: any) {
        throw new Error('Error updating bio', error);
    } finally {
        revalidatePath(path);
    }
};

// Get pictures of profile user
export const getProfilePicturesAction = async ({
    userId,
}: {
    userId: string;
}) => {
    try {
        await connectToDB();

        const images = await Image.find({ user_id: userId });
        const imagesUrls = images.map((img) => img.url);

        return JSON.parse(JSON.stringify(imagesUrls));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const addFriend = async ({ userId }: { userId: string }) => {
    try {
        const session = await getAuthSession();
        await connectToDB();

        const user = await User.findById(session?.user?.id);

        if (!user) {
            throw new Error('Không tìm thấy người dùng');
        }

        user.friends?.push(userId);

        user.save();
    } catch (error: any) {
        throw new Error(error);
    }
};

export const fetchInfomation = async ({ userId }: { userId: string }) => {
    try {
    } catch (error) {
        console.log(error);
    }
};

export const fetchPhotos = async ({ userId }: { userId: string }) => {
    try {
        const images = await Image.find({ user_id: userId });

        return JSON.parse(JSON.stringify(images));
    } catch (error) {
        console.log(error);
    }
};
