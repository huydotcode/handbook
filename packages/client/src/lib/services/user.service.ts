import { SortOrder } from 'mongoose';
import {
    follow,
    getFriendsByUserId,
    getUserByUserId,
    searchUsers,
    unfollow,
    unfriend,
} from '../actions/user.action';

interface IUserService {
    searchUsers: ({
        userId,
        searchString,
        pageNumber,
        pageSize,
        sortBy,
    }: {
        userId: string;
        searchString?: string;
        pageNumber?: number;
        pageSize?: number;
        sortBy?: SortOrder;
    }) => Promise<{
        users: IUser[];
        isNext: boolean;
    }>;

    getFriendsByUserId: ({ userId }: { userId: string }) => Promise<IFriend[]>;

    getById: (id: string) => Promise<IUser | null>;

    unfriend: (userId: string) => Promise<boolean>;

    follow: (userId: string) => Promise<boolean>;
    unfollow: (userId: string) => Promise<boolean>;
}

class UserServiceClass implements IUserService {
    async searchUsers({
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
    }): Promise<{ users: IUser[]; isNext: boolean }> {
        const { users, isNext } = await searchUsers({
            userId,
            searchString,
            pageNumber,
            pageSize,
            sortBy,
        });
        return { users, isNext };
    }

    async getFriendsByUserId({
        userId,
    }: {
        userId: string;
    }): Promise<IFriend[]> {
        const friends = await getFriendsByUserId({
            userId,
        });
        return friends;
    }

    async getById(id: string): Promise<IUser | null> {
        const user = await getUserByUserId({
            userId: id,
        });
        return user;
    }

    async unfriend(userId: string): Promise<boolean> {
        const result = await unfriend({
            friendId: userId,
        });
        return result;
    }

    async follow(userId: string): Promise<boolean> {
        const result = await follow({
            userId,
        });
        return result;
    }

    async unfollow(userId: string): Promise<boolean> {
        const result = await unfollow({
            userId,
        });
        return result;
    }
}

const UserService = new UserServiceClass();
export default UserService;
