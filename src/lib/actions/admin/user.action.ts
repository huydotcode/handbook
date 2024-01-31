'use server';

import { User } from '@/models';
import connectToDB from '@/services/mongoose';

function JSON_parse(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}

export const fetchUsersCount = async () => {
    try {
        await connectToDB();

        const count = await User.countDocuments();

        return JSON_parse(count);
    } catch (error) {
        console.log('Error fetching users count:', error);
    }
};

export const fetchUsers = async ({ limit = 10 }: { limit?: number }) => {
    try {
        await connectToDB();

        const users = await User.find().limit(limit);

        return JSON_parse(users);
    } catch (error) {
        console.log('Error fetching users:', error);
    }
};
