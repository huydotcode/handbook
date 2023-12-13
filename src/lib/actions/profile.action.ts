'use server';
import Image from '@/models/Image';
import Profile from '@/models/Profile';
import connectToDB from '@/services/mongoose';
import { revalidatePath } from 'next/cache';

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
