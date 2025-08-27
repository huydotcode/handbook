'use server';
import { Conversation, User } from '@/models';
import Group from '@/models/Group';
import connectToDB from '@/services/mongoose';
import { Types } from 'mongoose';
import { Session } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { getAuthSession } from '../auth';
import ConversationService from '../services/conversation.service';
import { getConversationsByGroupId } from './conversation.action';

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
    console.log('[LIB-ACTIONS] createGroup');
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

        await User.updateMany(
            {
                _id: {
                    $in: [session.user.id, ...members],
                },
            },
            {
                $push: {
                    groups: newGroup._id,
                },
            }
        );

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
    console.log('[LIB-ACTIONS] getGroupsByUserId');
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
    console.log('[LIB-ACTIONS] getGroupByGroupId');
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

export const getRecommendGroups = async ({ userId }: { userId: string }) => {
    console.log('[LIB-ACTIONS] getRecommendGroups');
    try {
        await connectToDB();

        const groups = await Group.find({
            members: {
                $not: {
                    $elemMatch: {
                        user: new Types.ObjectId(userId),
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
    console.log('[LIB-ACTIONS] getMembersByGroupId');
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
    path,
}: {
    groupId: string;
    userId: string;
    path?: string;
}) => {
    console.log('[LIB-ACTIONS] leaveGroup');

    try {
        await connectToDB();

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

        await Conversation.find({
            group: groupId,
        }).updateMany({
            $pull: {
                participants: {
                    user: userId,
                },
            },
        });

        if (path) {
            revalidatePath(path);
        }

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const deleteGroup = async ({ groupId }: { groupId: string }) => {
    console.log('[LIB-ACTIONS] deleteGroup');
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
            await ConversationService.delete(conversation._id.toString());
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
    console.log('[LIB-ACTIONS] joinGroup');
    try {
        await connectToDB();

        // Kiểm tra xem người dùng đã là thành viên của nhóm chưa
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error('Nhóm không tồn tại');
        }

        const isMember = group.members.some(
            (member: IMemberGroup) => member.user.toString() === userId
        );

        if (isMember) {
            throw new Error('Bạn đã là thành viên của nhóm này');
        }

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

export const updateCoverPhoto = async ({
    groupId,
    coverPhoto,
    path,
}: {
    groupId: string;
    coverPhoto: string;
    path: string;
}) => {
    console.log('[LIB-ACTIONS] updateCoverPhoto');
    try {
        await connectToDB();

        await Group.updateOne(
            {
                _id: groupId,
            },
            {
                coverPhoto,
            }
        );
    } catch (error: any) {
        throw new Error(error);
    } finally {
        revalidatePath(path);
    }
};

export const updateAvatar = async ({
    groupId,
    avatarId,
    path,
}: {
    groupId: string;
    avatarId: string;
    path: string;
}) => {
    console.log('[LIB-ACTIONS] updateAvatar');
    try {
        await connectToDB();

        await Group.updateOne(
            {
                _id: groupId,
            },
            {
                avatar: avatarId,
            }
        );
    } catch (error: any) {
        throw new Error(error);
    } finally {
        revalidatePath(path);
    }
};

export const updateGroup = async ({
    groupId,
    name,
    description,
    type,
    path,
}: {
    groupId: string;
    name: string;
    description: string;
    type: string;
    path?: string;
}) => {
    console.log('[LIB-ACTIONS] updateGroup');
    try {
        await connectToDB();

        await Group.findByIdAndUpdate(groupId, {
            name,
            description,
            type,
        });

        if (path) revalidatePath(path);

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};
