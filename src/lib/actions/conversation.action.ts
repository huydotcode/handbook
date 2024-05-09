'use server';
import { getAuthSession } from '../auth';
import connectToDB from '@/services/mongoose';
import { GroupConversation, PrivateConversation } from '@/models';

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

        const conversation = await PrivateConversation.findOne({
            _id: conversationId,
            members: {
                $in: [session?.user.id],
            },
        }).populate(
            'members',
            '_id name avatar username isOnline lastAccessed'
        );

        if (!conversation) {
            const otherMember = conversationId.replace(session?.user.id, '');

            // Tạo mới
            const newConversation = new PrivateConversation({
                _id: conversationId,
                members: [session?.user.id, otherMember],
            });

            await newConversation.save();

            const newConversationPopulated = await PrivateConversation.findOne({
                _id: newConversation._id,
            }).populate('members', POPULATE_USER);

            return JSON.parse(JSON.stringify(newConversationPopulated));
        }

        return JSON.parse(JSON.stringify(conversation));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getConversations = async () => {
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Chưa đăng nhập');

        const conversations = await PrivateConversation.find({
            members: {
                $in: [session?.user.id],
            },
        }).populate('members', POPULATE_USER);

        return JSON.parse(
            JSON.stringify(conversations)
        ) as IPrivateConversation[];
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getGroupConversation = async ({
    conversationId,
}: {
    conversationId: string;
}) => {
    try {
        await connectToDB();

        const session = await getAuthSession();

        if (!session) throw new Error('Chưa đăng nhập');

        const conversation = await GroupConversation.findOne({
            _id: conversationId,
            members: {
                $in: [session?.user.id],
            },
        }).populate('members.user', POPULATE_USER);

        if (!conversation) {
            return null;
        }

        return JSON.parse(JSON.stringify(conversation));
    } catch (error: any) {
        throw new Error(error);
    }
};
