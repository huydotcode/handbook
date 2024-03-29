'use server';
import { Image, Location, Profile, User } from '@/models';
import connectToDB from '@/services/mongoose';
import { revalidatePath } from 'next/cache';

export const getProfileByUserId = async ({ query }: { query: string }) => {
    try {
        await connectToDB();

        const user = await User.findOne({
            $or: [{ _id: query }, { username: query }],
        });

        const profile = await Profile.findOne({
            user: user?._id,
        }).populate('user');

        return JSON.parse(JSON.stringify(profile));
    } catch (error: any) {
        throw new Error(error);
    }
};

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

        const images = await Image.find({ creator: userId });
        const imagesUrls = images.map((img) => img.url) as string[];

        return JSON.parse(JSON.stringify(imagesUrls));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const updateInfo = async ({
    profileId,
    dateOfBirth,
    education,
    location,
    work,
    path,
}: {
    profileId: string;
    work: string;
    education: string;
    location: string;
    dateOfBirth: Date;
    path: string;
}) => {
    try {
        await connectToDB();

        await Profile.findByIdAndUpdate(profileId, {
            dateOfBirth,
            education,
            location,
            work,
        });

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getLocations = async () => {
    try {
        await connectToDB();

        const locations = await Location.find();

        return JSON.parse(JSON.stringify(locations));
    } catch (error: any) {
        throw new Error(error);
    }
};
