'use server';
import { User } from '@/models';
import Follows from '@/models/Follows';
import connectToDB from '@/services/mongoose';
import logger from '@/utils/logger';
import { SortOrder } from 'mongoose';
import { getAuthSession } from '../auth';

/*
    * Notification Model: 
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    message: string;
    isRead: boolean;
    type: string;
*/

export const searchUsers = async ({
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
        const sortOptions = { createdAt: sortBy };

        const usersQuery = User.find({
            $text: {
                $search: searchString,
            },
        })
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalUsersCount = await User.countDocuments({
            $text: {
                $search: searchString,
            },
        });

        const users = await usersQuery;

        const isNext = totalUsersCount > skipAmount + users.length;

        return { users: JSON.parse(JSON.stringify(users)), isNext };
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getFriendsByUserId = async ({ userId }: { userId: string }) => {
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

        await User.updateOne(
            {
                _id: session.user.id,
            },
            {
                $pull: {
                    friends: friendId,
                },
            }
        );

        await User.updateOne(
            {
                _id: friendId,
            },
            {
                $pull: {
                    friends: session.user.id,
                },
            }
        );

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

        if (user && user.password === undefined) {
            return {
                error: {
                    type: 'password',
                    message: 'Đăng nhập thất bại',
                },
            };
        }

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
    } catch (error: any) {
        console.log(error);
    }

    return null;
};

export const getFollowersByUserId = async ({ userId }: { userId: string }) => {
    try {
        await connectToDB();
        const user = await User.findById(userId).exec();
        if (!user) throw new Error('Đã có lỗi xảy ra');

        const follows = await Follows.find({
            following: userId,
        }).populate(
            'follower',
            '_id name avatar username isOnline lastAccessed'
        );

        const followers = follows.map((follow) => follow.follower);

        return JSON.parse(JSON.stringify(followers));
    } catch (error: any) {
        logger({
            message: 'Error get followers' + error,
            type: 'error',
        });
    }
};

export const follow = async ({ userId }: { userId: string }) => {
    try {
        await connectToDB();
        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        const existingFollow = await Follows.findOne({
            follower: session.user.id,
            following: userId,
        });

        if (existingFollow) {
            return JSON.parse(JSON.stringify(existingFollow));
        }

        const newFollow = new Follows({
            follower: session.user.id,
            following: userId,
        });

        await newFollow.save();

        const user = await User.findById(userId).exec();

        return JSON.parse(JSON.stringify(user));
    } catch (error: any) {
        logger({
            message: 'Error follow' + error,
            type: 'error',
        });
    }
};

export const unfollow = async ({ userId }: { userId: string }) => {
    try {
        await connectToDB();
        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        await User.updateOne(
            {
                _id: session.user.id,
            },
            {
                $pull: {
                    followings: userId,
                },
            }
        );

        await User.updateOne(
            {
                _id: userId,
            },
            {
                $pull: {
                    followers: session.user.id,
                },
            }
        );

        return true;
    } catch (error: any) {
        logger({
            message: 'Error unfollow' + error,
            type: 'error',
        });
    }

    return false;
};
