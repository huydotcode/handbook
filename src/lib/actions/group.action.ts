'use server';
import Group from '@/models/Group';
import connectToDB from '@/services/mongoose';
import { Session } from 'next-auth';
import { getAuthSession } from '../auth';
import { User } from '@/models';

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

        return {
            msg: 'Tạo nhóm thành công!',
            success: true,
            data: JSON.parse(JSON.stringify(newGroup)),
        };
    } catch (error) {
        return {
            msg: 'Có lỗi xảy ra khi tạo nhóm, vui lòng thử lại sau!',
            success: false,
        };
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
    } catch (error) {
        return {
            msg: 'Có lỗi xảy ra khi lấy danh sách nhóm, vui lòng thử lại sau!',
            success: false,
        };
    }
};

export const getGroup = async ({ groupId }: { groupId: string }) => {
    try {
        await connectToDB();
        const session = (await getAuthSession()) as Session;

        if (!session?.user) {
            return {
                msg: 'Bạn cần đăng nhập để thực hiện tính năng này!',
                success: false,
            };
        }

        const group = await Group.findById(groupId);

        return {
            msg: 'Lấy thông tin nhóm thành công!',
            success: true,
            data: JSON.parse(JSON.stringify(group)),
        };
    } catch (error) {
        return {
            msg: 'Có lỗi xảy ra khi lấy thông tin nhóm, vui lòng thử lại sau!',
            success: false,
        };
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

        return {
            msg: 'Lấy danh sách thành viên nhóm thành công!',
            success: true,
            data: JSON.parse(JSON.stringify(members)) as IUser[],
        };
    } catch (error: any) {
        throw new Error(error);
    }
};
