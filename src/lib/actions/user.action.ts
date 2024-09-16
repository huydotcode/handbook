'use server';
import { Conversation, Participant, User } from '@/models';
import connectToDB from '@/services/mongoose';
import { FilterQuery, SortOrder } from 'mongoose';
import { getAuthSession } from '../auth';
import logger from '@/utils/logger';

/*
    * Notification Model: 
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    message: string;
    isRead: boolean;
    type: string;
*/

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
        if (!user) throw new Error('Đã có lỗi xảy ra');
        const friends = await User.find({
            _id: { $in: user.friends },
        }).select('_id name avatar username isOnline lastAccessed');

        return JSON.parse(JSON.stringify(friends));
    } catch (error: any) {
        logger({
            message: 'Error get friends' + error,
            type: 'error',
        });
    }
};

export const getUserByUserId = async ({ userId }: { userId: string }) => {
    if (userId.trim().length === 0) return;

    try {
        await connectToDB();

        const friend = await User.findById(userId).select(
            '_id name avatar username isOnline lastAccessed'
        );

        return JSON.parse(JSON.stringify(friend));
    } catch (error: any) {
        logger({
            message: 'Error get user by user id' + error,
            type: 'error',
        });
    }
};

export const unfriend = async ({ friendId }: { friendId: string }) => {
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');
        const user = await User.findById(session.user.id).exec();
        if (!user) throw new Error('Đã có lỗi xảy ra');
        const friend = await User.findById(friendId).exec();
        if (!friend) throw new Error('Đã có lỗi xảy ra');
        user.friends = user.friends.filter((id) => id.toString() !== friendId);
        friend.friends = friend.friends.filter(
            (id) => id.toString() !== session.user.id
        );
        await user.save();
        await friend.save();

        // Xóa conversation
        const paticipants = await Participant.find({
            userId: { $in: [session.user.id, friendId] },
        }).select('_id');

        await Conversation.deleteMany({
            participants: { $all: paticipants.map((p) => p._id) },
        });

        return true;
    } catch (error: any) {
        logger({
            message: 'Error un friend' + error,
            type: 'error',
        });
    }
};

export const checkAuth = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    try {
        await connectToDB();

        const user = (await User.findOne({
            email: email,
        })) as User;

        if (!user) {
            return {
                error: {
                    type: 'email',
                    message: 'Người dùng không tồn tại',
                },
            };
        }

        const isValid = await user.comparePassword(password);

        if (!isValid) {
            return {
                error: {
                    type: 'password',
                    message: 'Mật khẩu không đúng',
                },
            };
        }
    } catch (error) {}

    return null;
};
