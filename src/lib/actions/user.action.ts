'use server';
import connectToDB from '@/services/mongoose';
import User from '@/models/User';
import Profile from '@/models/Profile';
import mongoose, { FilterQuery, SortOrder } from 'mongoose';

export const fetchProfileByUserId = async (userId: string) => {
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
            })) as User;
        }

        if (!user) throw new Error('User not found');

        return { user, profile };
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export async function fetchUsers({
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
}) {
    try {
        await connectToDB();

        // Calculate the number of users to skip based on the page number and page size.
        const skipAmount = (pageNumber - 1) * pageSize;

        // Create a case-insensitive regular expression for the provided search string.
        const regex = new RegExp(searchString, 'i');

        // Create an initial query object to filter users.
        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }, // Exclude the current user from the results.
        };

        // If the search string is not empty, add the $or operator to match either username or name fields.
        if (searchString.trim() !== '') {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } },
            ];
        }

        // Define the sort options for the fetched users based on createdAt field and provided sort order.
        const sortOptions = { createdAt: sortBy };

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        // Count the total number of users that match the search criteria (without pagination).
        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery;

        // Check if there are more users beyond the current page.
        const isNext = totalUsersCount > skipAmount + users.length;

        return { users: JSON.parse(JSON.stringify(users)), isNext };
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}
