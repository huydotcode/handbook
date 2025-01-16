'use server';
import Group from '@/models/Group';
import connectToDB from '@/services/mongoose';
import mongoose, { Types } from 'mongoose';
import { Session } from 'next-auth';
import { getAuthSession } from '../auth';
import {
    deleteConversation,
    getConversationsByGroupId,
} from './conversation.action';
import { User } from '@/models';

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

export const getGroupsByUserId = async ({
    userId,
    page,
    pageSize,
}: {
    userId: string;
    page: number;
    pageSize: number;
}) => {
    try {
        await connectToDB();

        const groups = await Group.find({
            members: {
                $elemMatch: {
                    user: new Types.ObjectId(userId),
                },
            },
        })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .populate('avatar')
            .populate('creator')
            .populate('members.user');

        return JSON.parse(JSON.stringify(groups)) as IGroup[];
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getGroupByGroupId = async ({ groupId }: { groupId: string }) => {
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
            .populate('avatar')
            .populate('members.user')
            .populate('creator');

        return JSON.parse(JSON.stringify(group));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getRecommendGroups = async () => {
    try {
        await connectToDB();

        const session = await getAuthSession();

        const groups = await Group.find({
            members: {
                $not: {
                    $elemMatch: {
                        user: new Types.ObjectId(session?.user.id),
                    },
                },
            },
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('avatar')
            .populate('creator')
            .populate('members.user');

        return JSON.parse(JSON.stringify(groups)) as IGroup[];
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getMembersByGroupId = async ({ groupId }: { groupId: string }) => {
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
        const group = await Group.findById(groupId)
            .populate('avatar')
            .populate('members.user')
            .populate('creator');

        return JSON.parse(JSON.stringify(group.members));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const leaveGroup = async ({
    groupId,
    userId,
}: {
    groupId: string;
    userId: string;
}) => {
    const session = await mongoose.startSession();

    try {
        // Begin transaction
        await connectToDB();

        session.startTransaction();

        await Group.findByIdAndUpdate(groupId, {
            $pull: {
                members: {
                    user: userId,
                },
            },
        });

        await User.findByIdAndUpdate(userId, {
            $pull: {
                groups: groupId,
            },
        });

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        return true;
    } catch (error: any) {
        // Rollback transaction
        await session.abortTransaction();
        session.endSession();

        throw new Error(error);
    }
};

export const deleteGroup = async ({ groupId }: { groupId: string }) => {
    // Xóa nhóm, hội thoại nhóm, participant trong nhóm
    try {
        await connectToDB();
        const session = (await getAuthSession()) as Session;

        if (!session?.user) {
            throw new Error('Bạn cần đăng nhập để thực hiện tính năng này!');
        }

        const group = await Group.findById(groupId);

        // Kiểm tra quyền của người xóa
        if (group?.creator != session.user.id) {
            throw new Error('Bạn không có quyền xóa nhóm này!');
        }

        const conversatios = await getConversationsByGroupId({
            groupId,
        });

        for (const conversation of conversatios) {
            await deleteConversation({
                conversationId: conversation._id,
            });
        }

        await Group.deleteOne({
            _id: groupId,
        });

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const joinGroup = async ({
    groupId,
    userId,
}: {
    groupId: string;
    userId: string;
}) => {
    try {
        await connectToDB();

        await Group.updateOne(
            {
                _id: groupId,
            },
            {
                $push: {
                    members: {
                        user: userId,
                        role: 'member',
                    },
                },
            }
        );

        await User.updateOne(
            {
                _id: userId,
            },
            {
                $push: {
                    groups: groupId,
                },
            }
        );
    } catch (error: any) {
        throw new Error(error);
    }
};
