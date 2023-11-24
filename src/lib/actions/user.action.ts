import connectToDB from '@/services/mongoose';
import User from '@/models/User';
import Profile from '@/models/Profile';
import mongoose from 'mongoose';

export const fetchUserData = async (id: string) => {
    if (!id) {
        throw new Error('Invalid id user');
    }
    try {
        await connectToDB();
        const user = (await User.findOne({ _id: id })) as User;
        if (!user) throw new Error('User not found');
        return user;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const fetchSomeFriendUser = async (userId: string) => {
    try {
        await connectToDB();
        const user = (await User.findById(userId)) as User;
        const someFriendsId = user.friends.slice(-6);
        const someFriendsData = [];
        for (const id of someFriendsId) {
            const friend = (await User.findById(id)) as User;
            someFriendsData.push({
                id: friend._id,
                image: friend.image,
                name: friend.name,
            });
        }
        return someFriendsData;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const fetchProfileByUserId = async (userId: string) => {
    if (!userId) throw new Error('Invalid id user');

    try {
        await connectToDB();
        let profile;

        profile = (await Profile.findOne({
            username: userId,
        })) as IProfile;

        console.log(mongoose.isValidObjectId(userId));

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
            })) as User;
        }

        if (!user) throw new Error('User not found');

        return { user, profile };
    } catch (error: any) {
        throw new Error(error.message);
    }
};
