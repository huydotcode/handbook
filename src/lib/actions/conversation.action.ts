'use server';
import { UserRole } from '@/enums/UserRole';
import { Conversation } from '@/models';
import ConversationRole from '@/models/ConversationRole';
import connectToDB from '@/services/mongoose';
import { getAuthSession } from '../auth';
import MessageService from '../services/message.service';

export const createConversationRoleAdmin = async ({
    userId,
    conversationId,
    role = UserRole.ADMIN,
}: {
    userId: string;
    conversationId: string;
    role?: string;
}) => {
    console.log('[LIB-ACTIONS] createConversationRoleAdmin');
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
    console.log('[LIB-ACTIONS] createConversationAfterAcceptFriend');
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

export const joinConversation = async ({
    conversationId,
    userId,
}: {
    conversationId: string;
    userId: string;
}) => {
    console.log('[LIB-ACTIONS] joinConversation');
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Chưa đăng nhập');

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            throw new Error('Cuộc trò chuyện không tồn tại');
        }

        if (conversation.participants.includes(userId)) {
            throw new Error('Bạn đã là thành viên của cuộc trò chuyện này');
        }

        conversation.participants.push(userId);
        await conversation.save();
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getConversationById = async ({
    conversationId,
}: {
    conversationId: string;
}) => {
    console.log('[LIB-ACTIONS] getConversationById');
    try {
        await connectToDB();

        const conversation = await Conversation.findOne({
            _id: conversationId,
        })
            .populate('participants')
            .populate('creator')
            .populate({
                path: 'group',
                populate: {
                    path: 'avatar', // Populate đến model Image
                    model: 'Media', // Đảm bảo tên model chính xác
                },
            });

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
    console.log('[LIB-ACTIONS] getConversationsByGroupId');
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
    console.log('[LIB-ACTIONS] createConversation');
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

export const getConversationByParticipants = async ({
    userId,
    otherUserId,
}: {
    userId: string;
    otherUserId: string;
}) => {
    console.log('[LIB-ACTIONS] getConversationByParticipants');
    try {
        await connectToDB();

        const conversation = await Conversation.findOne({
            participants: {
                $all: [userId, otherUserId],
            },
            type: 'private',
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
    console.log('[LIB-ACTIONS] deleteConversation');
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

export const deleteConversationByUserId = async ({
    conversationId,
    userId,
}: {
    conversationId: string;
    userId: string;
}) => {
    console.log('[LIB-ACTIONS] deleteConversationByUserId');
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Chưa đăng nhập');

        const conversation = await Conversation.findByIdAndUpdate(
            conversationId,
            {
                $addToSet: {
                    isDeletedBy: userId,
                },
            },
            { new: true }
        );

        return JSON.parse(JSON.stringify(conversation));
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
    console.log('[LIB-ACTIONS] getConversationWithTwoUsers');
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

export const addPinMessage = async ({
    conversationId,
    messageId,
}: {
    conversationId: string;
    messageId: string;
}) => {
    console.log('[LIB-ACTIONS] addPinMessage');
    try {
        await connectToDB();

        await Conversation.findByIdAndUpdate(
            {
                _id: conversationId,
            },
            {
                $set: {
                    $push: {
                        pinnedMessages: messageId,
                    },
                },
            }
        );

        await MessageService.pin(messageId);

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const removePinMessage = async ({
    conversationId,
    messageId,
}: {
    conversationId: string;
    messageId: string;
}) => {
    console.log('[LIB-ACTIONS] removePinMessage');
    try {
        await connectToDB();

        await Conversation.findByIdAndUpdate(
            {
                _id: conversationId,
            },
            {
                $pull: {
                    pinnedMessages: messageId,
                },
            }
        );

        await MessageService.unpin(messageId);

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const leaveConversation = async ({
    conversationId,
    userId,
}: {
    conversationId: string;
    userId: string;
}) => {
    console.log('[LIB-ACTIONS] leaveConversation');

    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Chưa đăng nhập');

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            throw new Error('Cuộc trò chuyện không tồn tại');
        }

        if (!conversation.participants.includes(userId)) {
            throw new Error(
                'Bạn không phải là thành viên của cuộc trò chuyện này'
            );
        }

        conversation.participants = conversation.participants.filter(
            (participant: string) => participant.toString() !== userId
        );

        await conversation.save();

        return JSON.parse(JSON.stringify(conversation));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const undeleteConversationByUserId = async ({
    conversationId,
    userId,
}: {
    conversationId: string;
    userId: string;
}) => {
    console.log('[LIB-ACTIONS] undeleteConversationByUserId');
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Chưa đăng nhập');

        const conversation = await Conversation.findByIdAndUpdate(
            conversationId,
            {
                $pull: {
                    isDeletedBy: userId,
                },
            },
            { new: true }
        );

        return JSON.parse(JSON.stringify(conversation));
    } catch (error: any) {
        throw new Error(error);
    }
};
