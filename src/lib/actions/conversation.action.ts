'use server';
import { Conversation, Participant } from '@/models';
import connectToDB from '@/services/mongoose';
import { getAuthSession } from '../auth';

// f: Trang nhắn với bạn bè
// r: Trang nhắn với người lạ
// d: Trang nhắn với nhóm
// c: Trang nhắn với trang

const POPULATE_USER = 'name avatar username isOnline lastAccessed';

export const getType = (conversationType: string) => {
    switch (conversationType) {
        case 'f':
            return 'friend';
        case 'r':
            return 'stranger';
        case 'd':
            return 'group';
        case 'c':
            return 'page';
        default:
            return 'friend';
    }
};

// Hàm tạo conversation sau khi kết bạn
export const createConversationAfterAcceptFriend = async ({
    userId,
    friendId,
}: {
    userId: string;
    friendId: string;
}) => {
    try {
        await connectToDB();

        const newConversation = new Conversation({
            title: 'Cuộc trò chuyện mới',
            creator: userId,
            participants: [],
        });
        await newConversation.save();

        // Tạo participant cho user
        const newParticipant = new Participant({
            conversation: newConversation._id,
            user: userId,
        });
        await newParticipant.save();
        newConversation.participants.push(newParticipant._id);

        // Tạo participant cho friend
        const newParticipantFriend = new Participant({
            conversation: newConversation._id,
            user: friendId,
        });
        await newParticipantFriend.save();
        newConversation.participants.push(newParticipantFriend._id);

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

        await Participant.populate(conversation, {
            path: 'participants.user',
        });

        return JSON.parse(JSON.stringify(conversation));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getConversation = async ({
    conversationId,
    conversationType,
}: {
    conversationId: string;
    conversationType: 'f' | 'r' | 'd' | 'c';
}) => {
    try {
        await connectToDB();

        const session = await getAuthSession();

        if (!session) throw new Error('Chưa đăng nhập');

        const type = getType(conversationType);

        if (type === 'group') {
            return null;
        }

        return null;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getConversations = async () => {
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Chưa đăng nhập');

        const participants = await Participant.find({
            user: session.user.id,
        })
            .populate('conversation')
            .populate('user');

        const conversations = await Conversation.find({
            participants: {
                $in: participants.map((participant) => participant._id),
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

        for (const conversation of conversations) {
            await Participant.populate(conversation, {
                path: 'participants.user',
            });
        }

        return JSON.parse(JSON.stringify(conversations));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const createConversation = async ({
    creator,
    participantsUserId,
    status = 'active',
    title = 'Cuộc hội thoại mới',
    groupId = null,
}: {
    participantsUserId: string[];
    creator: string;
    title?: string;
    status?: string;
    groupId?: string | null;
}) => {
    try {
        await connectToDB();

        const newConversation = new Conversation({
            title,
            creator,
            participants: [],
            status,
            group: groupId,
        });

        await newConversation.save();

        for (const userId of participantsUserId) {
            // Tạo participant
            const newParticipant = new Participant({
                conversation: newConversation._id,
                user: userId,
            });

            await newParticipant.save();

            newConversation.participants.push(newParticipant._id);
        }

        await newConversation.save();

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

        const participants = await Participant.find({
            user: userId,
        }).populate('conversation', POPULATE_USER);

        const conversations = await Conversation.find({
            participants: {
                $in: participants.map((participant) => participant._id),
            },
        })
            .populate('participants')
            .populate('creator')
            .populate('group');

        await Participant.populate(conversations, {
            path: 'participants.user',
        });

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

        const participant = await Participant.findOne({
            user: userId,
        });

        const otherParticipant = await Participant.findOne({
            user: otherUserId,
        });

        const conversation = await Conversation.findOne({
            participants: {
                $all: [participant?._id, otherParticipant?._id],
            },
        });

        if (!conversation) {
            return null;
        }

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

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            throw new Error('Không tìm thấy cuộc trò chuyện');
        }

        // Xóa participant
        await Participant.deleteMany({
            conversation: conversation._id,
        });

        // Xóa cuộc trò chuyện
        await Conversation.deleteOne({ _id: conversationId });

        return true;
    } catch (error: any) {
        throw new Error(error);
    }

    return false;
};
