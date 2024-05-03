'use server';
import Group from '@/models/Group';
import connectToDB from '@/services/mongoose';
import { Session } from 'next-auth';
import { getAuthSession } from '../auth';
import { User } from '@/models';
import mongoose from 'mongoose';

/*
    * Group Model: 
    name: string;
    description: string;
    avatar: string;
    members: Schema.Types.ObjectId[];
    creator: Schema.Types.ObjectId;
    coverPhoto: string;
    type: string;
    introduction: string;
*/

const POPULATE_USER = 'name username avatar';

// Tạo nhóm mới
export const createGroup = async ({
    name,
    description,
    avatar,
    type,
    members,
}: {
    name: string;
    description: string;
    avatar: string;
    type: string;
    members: string[];
}) => {
    try {
        await connectToDB();
        const session = (await getAuthSession()) as Session;

        if (!session?.user) {
            return {
                msg: 'Bạn cần đăng nhập để thực hiện tính năng này!',
                success: false,
            };
        }

        const newGroup = await new Group({
            name,
            description,
            avatar,
            type,
            creator: session.user.id,
            members: [session.user.id],
        });

        for (const memberId of members) {
            newGroup.members.push(memberId);
        }

        await newGroup.save();

        return JSON.parse(JSON.stringify(newGroup));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getGroups = async ({ userId }: { userId: string }) => {
    try {
        await connectToDB();
        const session = (await getAuthSession()) as Session;

        if (!session?.user) {
            return {
                msg: 'Bạn cần đăng nhập để thực hiện tính năng này!',
                success: false,
            };
        }

        const groups = await Group.find({
            members: {
                $in: [session?.user.id],
            },
        });

        return JSON.parse(JSON.stringify(groups));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getGroup = async ({ groupId }: { groupId: string }) => {
    try {
        await connectToDB();
        const session = (await getAuthSession()) as Session;

        if (!session?.user) {
            throw new Error('Bạn cần đăng nhập để thực hiện tính năng này!');
        }

        if (groupId == 'undefined' || !groupId) {
            return null;
        }

        const group = await Group.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(groupId),
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'members',
                    foreignField: '_id',
                    as: 'members',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'creator',
                    foreignField: '_id',
                    as: 'creator',
                },
            },
        ]);

        const group2 = await Group.findById(groupId).populate('members');

        console.log({
            group: JSON.parse(JSON.stringify(group2)),
        });

        return JSON.parse(JSON.stringify(group[0]));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getMembers = async ({ groupId }: { groupId: string }) => {
    try {
        await connectToDB();
        const session = (await getAuthSession()) as Session;

        if (!session?.user) {
            return {
                msg: 'Bạn cần đăng nhập để thực hiện tính năng này!',
                success: false,
            };
        }

        // lấy thông tin các thành viên từ field members
        const group = await Group.findById(groupId);
        const members = [];

        // trả về thông tin các thành viên
        for (let i = 0; i < group?.members.length; i++) {
            const user = await User.findById(group.members[i]).select(
                POPULATE_USER
            );

            members.push(user);
        }

        return JSON.parse(JSON.stringify(members));
    } catch (error: any) {
        throw new Error(error);
    }
};
