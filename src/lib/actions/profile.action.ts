'use server';
import { Image, Profile, User } from '@/models';
import connectToDB from '@/services/mongoose';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

export const updateBio = async ({
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

export const getProfileByUserId = async ({ userId }: { userId: string }) => {
    if (!userId) throw new Error('Invalid id user');

    try {
        await connectToDB();
        let profile;

        profile = (await Profile.findOne({
            username: userId,
        })) as IProfile;

        if (!profile && mongoose.isValidObjectId(userId)) {
            profile = (await Profile.findOne({
                userId: userId,
            })) as IProfile;
        }

        let user;

        user = (await User.findOne({
            username: userId,
        })) as User;

        if (!user && mongoose.isValidObjectId(userId)) {
            user = (await User.findOne({
                _id: userId,
            })) as IUser;
        }

        if (!user) throw new Error('User not found');

        return { user, profile };
    } catch (error) {
        console.log("Error fetching user's profile:", error);
    }
};
