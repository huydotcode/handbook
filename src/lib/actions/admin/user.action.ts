'use server';
import { Post, User } from '@/models';
import connectToDB from '@/services/mongoose';
import logger from '@/utils/logger';
import { revalidatePath } from 'next/cache';

function JSON_parse(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}

export const fetchUsersCount = async () => {
    try {
        await connectToDB();

        const count = await User.countDocuments();

        return JSON_parse(count);
    } catch (error) {
        logger({
            message: 'Error fetch user count' + error,
            type: 'error',
        });
    }
};

export const fetchUsers = async ({ limit = 10 }: { limit?: number }) => {
    try {
        await connectToDB();

        const users = await User.find().select('-password').limit(limit);
        return JSON_parse(users);
    } catch (error) {
        logger({
            message: 'Error fetch users' + error,
            type: 'error',
        });
    }
};

export const deleteUser = async ({
    userId,
    path,
}: {
    userId: string;
    path: string;
}) => {
    try {
        await User.findByIdAndDelete(userId);

        revalidatePath(path);
    } catch (error) {
        logger({
            message: 'Error delete user',
            type: 'error',
        });
    }
};
