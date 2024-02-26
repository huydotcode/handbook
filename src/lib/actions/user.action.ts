'use server';
import { Notification, User } from '@/models';
import connectToDB from '@/services/mongoose';
import { FilterQuery, SortOrder } from 'mongoose';

export const getUsers = async ({
    userId,
    searchString = '',
    pageNumber = 1,
    pageSize = 20,
    sortBy = 'desc',
}: {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
}) => {
    try {
        await connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize;
        const regex = new RegExp(searchString, 'i');
        const query: FilterQuery<typeof User> = {
            id: { $ne: userId },
        };

        if (searchString.trim() !== '') {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } },
            ];
        }

        const sortOptions = { createdAt: sortBy };

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery;

        const isNext = totalUsersCount > skipAmount + users.length;

        return { users: JSON.parse(JSON.stringify(users)), isNext };
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getFriends = async ({ userId }: { userId: string }) => {
    try {
        await connectToDB();
        const user = await User.findById(userId).exec();

        const friends = await User.find({
            _id: { $in: user?.friends },
        }).select('_id name image username isOnline lastAccessed');

        return JSON.parse(JSON.stringify(friends));
    } catch (error: any) {
        console.log(error);
    }
};

export const getUserByUserId = async ({ userId }: { userId: string }) => {
    if (userId.trim().length === 0) return;

    try {
        await connectToDB();

        const friend = await User.findById(userId).select(
            '_id name image username isOnline lastAccessed'
        );

        return JSON.parse(JSON.stringify(friend));
    } catch (error: any) {
        console.log(error);
    }
};

export const getNotifications = async ({ userId }: { userId: string }) => {
    if (userId.trim().length === 0) return;

    try {
        await connectToDB();

        const notifications = await Notification.find({
            receive: userId,
        })
            .populate('send', 'name image')
            .sort({ createdAt: 'desc' })
            .exec();

        return JSON.parse(JSON.stringify(notifications));
    } catch (error) {
        console.log(error);
    }
};
