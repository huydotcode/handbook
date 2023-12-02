'use server';
import Profile from '@/models/Profile';
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
        await Profile.updateOne({ userId: userId }, { bio: newBio });
    } catch (error: any) {
        throw new Error('Error updating bio', error);
    } finally {
        revalidatePath(path);
    }
};
