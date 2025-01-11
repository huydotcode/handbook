'use server';
import { Conversation } from '@/models';
import connectToDB from '@/services/mongoose';
import { getAuthSession } from '../auth';
import ConversationRole from '@/models/ConversationRole';

export const createConversationRoleAdmin = async ({
    userId,
    conversationId,
    role = 'admin',
}: {
    userId: string;
    conversationId: string;
    role?: string;
}) => {
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Chưa đăng nhập');

        const newConversationRole = new ConversationRole({
            userId: userId,
            conversationId: conversationId,
            role,
        });

        await newConversationRole.save();

        return JSON.parse(JSON.stringify(newConversationRole));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const createConversationAfterAcceptFriend = async ({
    userId,
    friendId,
}: {
    userId: string;
    friendId: string;
}) => {
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Chưa đăng nhập');

        const conversationExist = await getConversationByParticipants({
            userId,
            otherUserId: friendId,
        });

        if (conversationExist) {
            return JSON.parse(JSON.stringify(conversationExist));
        }

        const newConversation = new Conversation({
            title: 'Cuộc trò chuyện mới',
            creator: userId,
            participants: [userId, friendId],
        });
        await newConversation.save();

        return JSON.parse(JSON.stringify(newConversation));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getConversationById = async ({
    conversationId,
}: {
    conversationId: string;
}) => {
    try {
        await connectToDB();

        const conversation = await Conversation.findOne({
            _id: conversationId,
        })
            .populate('participants')
            .populate('creator')
            .populate('group');

        return JSON.parse(JSON.stringify(conversation));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getConversationsByGroupId = async ({
    groupId,
}: {
    groupId: string;
}) => {
    try {
        await connectToDB();

        const conversations = await Conversation.find({
            group: groupId,
        })
            .populate('participants')
            .populate('creator')
            .populate('group');

        return JSON.parse(JSON.stringify(conversations));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const createConversation = async ({
    creator,
    participantsUserId,
    status = 'active',
    title,
    groupId = null,
    type = 'private',
}: {
    participantsUserId: string[];
    creator: string;
    title?: string;
    status?: string;
    groupId?: string | null;
    type?: string;
}) => {
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Chưa đăng nhập');

        const newConversation = new Conversation({
            title,
            creator,
            participants: participantsUserId,
            status,
            group: groupId,
            type,
        });

        await newConversation.save();

        await createConversationRoleAdmin({
            userId: creator,
            conversationId: newConversation._id,
        });

        return JSON.parse(JSON.stringify(newConversation));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getConversationsByUserId = async ({
    userId,
}: {
    userId: string;
}) => {
    try {
        await connectToDB();

        const conversations = await Conversation.find({
            participants: {
                $elemMatch: { $eq: userId },
            },
        })
            .populate('participants')
            .populate('creator')
            .populate('group');

        return JSON.parse(JSON.stringify(conversations));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getConversationByParticipants = async ({
    userId,
    otherUserId,
}: {
    userId: string;
    otherUserId: string;
}) => {
    try {
        await connectToDB();

        const conversation = await Conversation.findOne({
            participants: {
                $all: [userId, otherUserId],
            },
        });

        return JSON.parse(JSON.stringify(conversation));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const deleteConversation = async ({
    conversationId,
}: {
    conversationId: string;
}) => {
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Chưa đăng nhập');

        await Conversation.deleteOne({ _id: conversationId });

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getConversationWithTwoUsers = async ({
    userId,
    otherUserId,
}: {
    userId: string;
    otherUserId: string;
}) => {
    try {
        await connectToDB();

        const conversationExist = await getConversationByParticipants({
            userId,
            otherUserId,
        });

        if (conversationExist) {
            return JSON.parse(
                JSON.stringify({
                    isNew: false,
                    conversation: conversationExist,
                })
            );
        } else {
            const newConversation = await createConversation({
                creator: userId,
                participantsUserId: [userId, otherUserId],
            });

            return JSON.parse(
                JSON.stringify({
                    isNew: true,
                    conversation: newConversation,
                })
            );
        }
    } catch (error: any) {
        throw new Error(error);
    }
};
