'use server';
import Group from '@/models/Group';
import connectToDB from '@/services/mongoose';
import { Session } from 'next-auth';
import { getAuthSession } from '../auth';

/*
    * Group Model: 
    name: string;
    description: string;
    avatar: string;
    members: GroupMember[];
    creator: Schema.Types.ObjectId;
    coverPhoto: string;
    type: string;
    introduction: string;
    lastActivity: Date;
*/

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

        if (!session)
            throw new Error('Bạn cần đăng nhập để thực hiện tính năng này!');

        const newGroup = await new Group({
            name,
            description,
            avatar,
            creator: session.user.id,
            members: [
                {
                    user: session.user.id,
                    role: 'admin',
                },
            ],
            type,
        });

        for (const memberId of members) {
            newGroup.members.push({
                user: memberId,
                role: 'member',
            });
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
                $elemMatch: {
                    user: userId,
                },
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

        const group = await Group.findById(groupId)
            .populate('members.user')
            .populate('creator');

        return JSON.parse(JSON.stringify(group));
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
        const group = await Group.findById(groupId).populate('members.user');

        return JSON.parse(JSON.stringify(group.members));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const createGroupConversation = async ({
    groupId,
    name,
    avatar,
    desc,
    members,
}: {
    groupId: string;
    name: string;
    avatar: string;
    desc: string;
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

        return null;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getGroupConversationsByGroupId = async ({
    groupId,
}: {
    groupId: string;
}) => {
    try {
        await connectToDB();

        return null;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getGroupConversationsByUserId = async ({
    userId,
}: {
    userId: string;
}) => {
    try {
        return null;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getGroupConversationById = async ({
    conversationId,
}: {
    conversationId: string;
}) => {
    try {
        await connectToDB();

        return null;
    } catch (error: any) {
        throw new Error(error);
    }
};
